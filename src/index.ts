import { Client, Intents } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { connect } from "mongoose";
// I'm not sure why I decided to use this lib
import NodeCache = require("node-cache");
import { chinaWords } from "./phrases";
import { comprehend } from "./comprehend";
import { commands } from "./commands";
import config from "../config.json";
import { generateCredit, generateLeaderboard } from "./embed";
import { leaderboard, lookup } from "./credit";
import { Leaderboard } from "./types";
import { leaderboardButtons } from "./buttons";
import { classifySentiment } from "./sentiment";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  ],
});
const quizCache = new NodeCache({ stdTTL: 500, checkperiod: 100 });
const creditCache = new NodeCache({ stdTTL: 1000, checkperiod: 100 });

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
  quizCache.set(message.author.id, "");

  if (Math.floor(Math.random() * 100) === 1) {
    //TODO Do quiz
  }

  for (const word of chinaWords)
    if (
      message.content.toLowerCase().includes(word) &&
      !(await creditCache.get(message.author.id))
    ) {
      creditCache.set(message.author.id, "");
      config.service == "aws"
        ? comprehend(message)
        : await classifySentiment(message);
      break;
    }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    switch (interaction.commandName) {
      case "leaderboard":
        const lb: Leaderboard = await leaderboard(1);
        return await interaction.reply({
          embeds: [generateLeaderboard(lb.users, 1)],
          components: [leaderboardButtons(1, lb.maxPages)],
        });

      case "credits":
        const user = interaction.options.getMentionable("citizen");
        //@ts-ignore
        await interaction.reply({
          embeds: [
            generateCredit(
              //@ts-ignore
              user ? await lookup(user.id) : interaction.member?.user.username,
              //@ts-ignore
              await lookup(interaction.member?.user.id),
              !!!user
            ),
          ],
        });
      default:
        break;
    }
  }

  if (interaction.isButton()) {
    const buttonInfo: string[] = interaction.customId.split("_");

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
