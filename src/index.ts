import {
  Client,
  Intents,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  User,
} from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { genPermissions } from "@joner/discord-bitfield-calculator";
import { connect } from "mongoose";
import { sentimentCooldown, quizCooldown, quizUsers } from "./discord/cooldown";
import { words } from "./util/phrases";
import { comprehend } from "./ai/aws";
import _ from "lodash";
import { commands } from "./discord/commands";
import config from "../config.json";
import {
  generateCredit,
  generateError,
  generateLeaderboard,
  generatePopQuestion,
  generateQuizQuestion,
  generateReply,
} from "./discord/embed";
import { leaderboard, lookup, update } from "./util/credit";
import { Leaderboard, Question } from "./util/types";
import { leaderboardButtons } from "./discord/buttons";
import { classifySentiment } from "./ai/openai";
import { popQuestions, questions } from "./util/qna";
import { popQuiz } from "./util/quiz";
import { users, servers } from "./util/model";
import { check } from "./discord/checks";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  ],
});
const rest = new REST({ version: "9" }).setToken(config.token);

client.on("ready", async () => {
  if (!client.user) process.exit(1);

  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Mode: ${config.mode}`);
  console.log(`AI: ${config.service}`);

  client.user.setPresence({
    status: "dnd",
    activities: [{ name: "the citizens of china", type: "WATCHING" }],
  });

  config.mode === "dev"
    ? await rest.put(
        Routes.applicationGuildCommands(client.user.id, config.guild),
        { body: commands }
      )
    : await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands,
      });
  console.log(
    `${commands.length} ${
      config.mode === "dev" ? "guild" : "global"
    } commands registered`
  );
});

client.on("messageCreate", async (message) => {
  if (
    message.author.bot ||
    (message.channel.type === "GUILD_TEXT" &&
      !message.channel
        .permissionsFor(client.user.id)
        .has(["SEND_MESSAGES", "ATTACH_FILES"]))
  )
    return;

  // Add users for quiz to set so only active users can take the quiz
  // if (!quizUsers.has(message.author)) {
  //   quizUsers.add(message.author);

  // Delete after two minutes
  //   setTimeout(() => quizUsers.delete(message.author), 120000);
  // }

  const userCheck = await check(message.author.id, "user");
  const guildCheck = await check(message.guild.id, "server");

  try {
    if (
      (Math.floor(Math.random() * 60) === 1 ||
        (message.author.id === config.owner &&
          config.mode === "dev" &&
          message.content.toLowerCase().includes("pop quiz dev"))) &&
      userCheck.quiz &&
      guildCheck.quiz
    ) {
      // const user: User =
      //   Array.from(quizUsers)[Math.floor(Math.random() * quizUsers.size)];
      const question: Question =
        popQuestions[Math.floor(Math.random() * popQuestions.length)];

      await message.channel.send({
        content: `<@${message.author.id}>`,
        embeds: [generatePopQuestion(question.question)],
      });

      popQuiz(
        message.channel.createMessageCollector({
          filter: (m) => m.author.id === message.author.id,
          time: 120000,
        }),
        question,
        message.author
      );
      sentimentCooldown.add(message.author.id);
      setTimeout(async () => {
        sentimentCooldown.delete(message.author.id);
        const score = Math.floor(Math.random() * (-100 - 75)) - 75;
        return await message.channel.send({
          content: `<@${message.author.id}>`,
          embeds: [generateReply(score, await update(message.author, score))],
        });
      }, 120000);
    }

    if (
      sentimentCooldown.has(message.author.id) ||
      !userCheck.sentiment ||
      !guildCheck.sentiment
    )
      return;
    for (const word of words)
      if (message.content.toLowerCase().includes(word.word)) {
        if (config.mode !== "dev") {
          sentimentCooldown.add(message.author.id);
          setTimeout(
            () => sentimentCooldown.delete(message.author.id),
            Math.floor(Math.random() * (600000 - 300000)) + 300000
          );
        }

        config.service == "aws"
          ? comprehend(message, word.good)
          : await classifySentiment(message, word.good);
        break;
      }
  } catch (e) {
    console.log(e);
    console.log("Error sending message");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    switch (interaction.commandName) {
      case "leaderboard":
        const lb: Leaderboard = await leaderboard(1);
        return await interaction.reply({
          embeds: [generateLeaderboard(lb.users, 1)],
          components: [leaderboardButtons(1, lb.prevPage, lb.nextPage)],
        });

      case "credits":
        const user = interaction.options.getUser("citizen");
        return await interaction.reply({
          embeds: [
            generateCredit(
              user ? user.username : interaction.member?.user.username,
              await lookup(user ? user.id : interaction.member?.user.id),
              !!!user
            ),
          ],
        });

      case "quiz":
        if (quizCooldown.has(interaction.user.id))
          return await interaction.reply({
            embeds: [
              generateError(
                "Sorry loyal citizen, you have taken a quiz too recently. Maybe you should take a look at your 抖音 feed in the meantime."
              ),
            ],
          });
        quizCooldown.add(interaction.user.id);
        setTimeout(() => quizCooldown.delete(interaction.user.id), 300000);

        const quiz = _.sampleSize(questions, 3);
        const indexes: number[] = [
          questions.indexOf(quiz[1]),
          questions.indexOf(quiz[2]),
        ];

        return await interaction.reply({
          embeds: [
            generateQuizQuestion(
              quiz[0].question,
              0,
              interaction.user.username
            ),
          ],
          components: [
            new MessageActionRow().addComponents(
              new MessageSelectMenu()
                .setCustomId(`${interaction.user.id}_${indexes.join("_")}`)
                .setOptions(quiz[0].answers)
            ),
          ],
        });

      case "settings":
        const type = interaction.options.getSubcommand();
        const flags = genPermissions(
          Number(interaction.memberPermissions.valueOf())
        );
        if (
          type === "server" &&
          (!interaction.inGuild || !flags.includes("ADMINISTRATOR"))
        )
          return await interaction.reply({
            embeds: [generateError("Not in guild or invalid permissions")],
          });

        const data =
          type === "user"
            ? await users.findById(interaction.user.id)
            : await servers.findById(interaction.guild.id);

        const ops = {
          sentiment:
            typeof interaction.options.getBoolean("sentiment") === "boolean"
              ? interaction.options.getBoolean("sentiment")
              : data
              ? data.sentiment
              : true,
          popQuiz:
            typeof interaction.options.getBoolean("quiz") === "boolean"
              ? interaction.options.getBoolean("quiz")
              : data
              ? data.popQuiz
              : true,
        };

        if (!data) {
          type === "user"
            ? await new users({
                _id: interaction.user.id,
                username: interaction.user.username,
                credit: 0,
                ...ops,
              }).save()
            : await new servers({
                _id: interaction.guild.id,
                ...ops,
              }).save();
        }

        type === "user"
          ? await users.updateOne({ _id: interaction.user.id }, ops)
          : await servers.updateOne({ _id: interaction.guild.id }, ops);

        return await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setDescription(
                `**Current Settings**\nSentiment: ${
                  ops.sentiment ? "🟢" : "🔴"
                }\nPop Quiz: ${ops.popQuiz ? "🟢" : "🔴"}`
              )
              .setFooter({ text: "Settings successfully changed" })
              .setColor("GREEN"),
          ],
          ephemeral: type === "user",
        });
      default:
        break;
    }
  }

  if (interaction.isSelectMenu()) {
    const selectInfo: string[] = interaction.customId.split("_");
    const user = selectInfo.shift();

    if (interaction.user.id !== user) return;
    const message = await interaction.channel.messages.fetch(
      interaction.message.id
    );

    if (interaction.values[0] !== "c") {
      await message.edit({
        embeds: [
          new MessageEmbed()
            .setColor("DARK_RED")
            .setTitle("WRONG! You have failed the quiz")
            .setDescription("-150 Social Credits")
            .setFooter({
              text: `Total Social Credits: ${await update(
                interaction.user,
                -150
              )}`,
            }),
        ],
        components: [],
      });
      return;
    }

    await interaction.deferUpdate();

    const question = questions[parseInt(selectInfo.shift())];

    if (!question) {
      await message.edit({
        embeds: [generateReply(300, await update(interaction.user, 300))],
        components: [],
      });
      return;
    }

    await message.edit({
      embeds: [
        generateQuizQuestion(
          question.question,
          selectInfo.length === 1 ? selectInfo.length : 2,
          interaction.user.username
        ),
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId(`${interaction.user.id}_${selectInfo}`)
            .setOptions(question.answers)
        ),
      ],
    });

    return;
  }

  if (interaction.isButton()) {
    const buttonInfo: string[] = interaction.customId.split("_");
    switch (buttonInfo[0]) {
      case "page":
        const lb: Leaderboard = await leaderboard(parseInt(buttonInfo[1]));
        return await interaction.update({
          embeds: [generateLeaderboard(lb.users, parseInt(buttonInfo[1]))],
          components: [
            leaderboardButtons(
              parseInt(buttonInfo[1]),
              lb.prevPage,
              lb.nextPage
            ),
          ],
        });

      case "settings":
        // settings, sentiment or quiz, guild or user, id, true or false
        break;
      default:
        break;
    }
  }
});

client.login(config.token);
connect(config.uri);
