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
  new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Manage settings")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Manage your settings")
        .addBooleanOption((option) =>
          option
            .setName("sentiment")
            .setDescription(
              "Increase/Decrease credit score based off of sentiment in messages."
            )
        )
        .addBooleanOption((option) =>
          option
            .setName("quiz")
            .setDescription(
              "Pop quizzes will/will not randomly show up for you."
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("guild")
        .setDescription("Manage guild settings (Admin only)")
        .addBooleanOption((option) =>
          option
            .setName("sentiment")
            .setDescription(
              "Increase/Decrease credit score based off of sentiment in messages."
            )
        )
        .addBooleanOption((option) =>
          option
            .setName("quiz")
            .setDescription(
              "Pop quizzes will/will not randomly show up in this guild."
            )
        )
    ),
].map((command) => command.toJSON());
