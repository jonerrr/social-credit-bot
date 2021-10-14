import { SlashCommandBuilder } from "@discordjs/builders";

export const commands = [
  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Social Credit Leaderboard"),
  new SlashCommandBuilder()
    .setName("credits")
    .setDescription("Lookup a comrades social credit score.")
    .addMentionableOption((option) =>
      option.setName("citizen").setDescription("Citizen to lookup")
    ),
].map((command) => command.toJSON());
