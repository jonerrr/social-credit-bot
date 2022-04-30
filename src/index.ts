import {
  Client,
  Intents,
  Message,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  User,
} from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
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
import { Leaderboard, Question, Quiz, QuizCache } from "./util/types";
import { leaderboardButtons } from "./discord/buttons";
import { classifySentiment } from "./ai/openai";
import { popQuestions, questions } from "./util/qna";
import { popQuiz } from "./util/quiz";

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
  if (message.author.bot) return;

  // Add users for quiz to set so only active users can take the quiz
  if (!quizUsers.has(message.author)) {
    quizUsers.add(message.author);

    // Delete after two minutes
    setTimeout(() => quizUsers.delete(message.author), 120000);
  }

  if (Math.floor(Math.random() * 30) === 1) {
    const user: User =
      Array.from(quizUsers)[Math.floor(Math.random() * quizUsers.size)];
    const question: Question =
      popQuestions[Math.floor(Math.random() * popQuestions.length)];

    await message.channel.send({
      content: `<@${user.id}>`,
      embeds: [generatePopQuestion(question.question)],
    });

    popQuiz(
      message.channel.createMessageCollector({
        filter: (m: Message) => m.author.id === message.author.id,
        time: 120000,
      }),
      question,
      user
    );

    sentimentCooldown.add(message.author.id);
    setTimeout(() => sentimentCooldown.delete(message.author.id), 130000);
  }

  for (const word of words)
    if (
      message.content.toLowerCase().includes(word.word) &&
      !sentimentCooldown.has(message.author.id)
    ) {
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
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    switch (interaction.commandName) {
      case "leaderboard":
        const lb: Leaderboard = await leaderboard(1);
        console.log(lb);
        return await interaction.reply({
          embeds: [generateLeaderboard(lb.users, 1)],
          components: [leaderboardButtons(1, lb.maxPages)],
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
    console.log(buttonInfo);
    switch (buttonInfo[0]) {
      case "page":
        const lb: Leaderboard = await leaderboard(parseInt(buttonInfo[1]));
        return await interaction.update({
          embeds: [generateLeaderboard(lb.users, parseInt(buttonInfo[1]))],
          components: [
            leaderboardButtons(parseInt(buttonInfo[1]), lb.maxPages),
          ],
        });

      default:
        break;
    }
  }
});

client.login(config.token);
connect(config.uri);
