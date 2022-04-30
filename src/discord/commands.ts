import { SlashCommandBuilder } from "@discordjs/builders";

export const commands = [
  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Social Credit Leaderboard"),
  new SlashCommandBuilder()
    .setName("quiz")
    .setDescription(
      "Take a quiz to test your knowledge on the great republic."
    ),
  new SlashCommandBuilder()
    .setName("credits")
    .setDescription("Lookup you or a comrade's social credit score.")
    .addUserOption((option) =>
      option.setName("citizen").setDescription("Citizen to lookup")
    ),
].map((command) => command.toJSON());
