import { MessageActionRow, MessageButton } from "discord.js";
import { Question } from "../util/types";
export function leaderboardButtons(
  currentPage: number,
  maxPages: number
): MessageActionRow {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`page_${currentPage - 2}`)
      .setEmoji("⏪")
      .setDisabled(currentPage <= 1)
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(`page_${currentPage--}`)
      .setEmoji("⬅️")
      .setDisabled(currentPage <= 1)
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(`page_${currentPage++}`)
      .setEmoji("➡️")
      .setDisabled(currentPage >= maxPages)
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(`page_${currentPage + 2}`)
      .setEmoji("⏩")
      .setDisabled(currentPage >= maxPages)
      .setStyle("SECONDARY")
  );
}

export function quizButtons(
  question: Question,
  current: number,
  asker: string,
  indexes: number[]
): MessageActionRow {
  const row = new MessageActionRow();

  question.answers.forEach((a) =>
    row.addComponents(
      new MessageButton()
        .setCustomId(`quiz_${indexes.join("_")}_${asker}`)
        .setStyle("PRIMARY")
        .setLabel(a)
    )
  );

  return row;
}
