import { ServerModel, UserModel } from "./../util/types";
import { MessageActionRow, MessageButton } from "discord.js";
export function leaderboardButtons(
  currentPage: number,
  prevPage: boolean,
  nextPage: boolean
): MessageActionRow {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`page_${currentPage - 1}`)
      .setEmoji("⬅️")
      .setDisabled(!prevPage)
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(`page_${currentPage + 1}`)
      .setEmoji("➡️")
      .setDisabled(!nextPage)
      .setStyle("SECONDARY")
  );
}

export function manageSettings(
  { _id, sentiment, popQuiz }: ServerModel | UserModel,
  type: "guild" | "user"
): MessageActionRow {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`settings_sentiment_${type}_${_id}_${sentiment}`)
      .setLabel("Sentiment")
      .setStyle(sentiment ? "SUCCESS" : "DANGER"),
    new MessageButton()
      .setCustomId(`settings_quiz_${type}_${_id}_${sentiment}`)
      .setLabel("Pop Quiz")
      .setStyle(popQuiz ? "SUCCESS" : "DANGER")
  );
}
