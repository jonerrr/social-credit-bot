import { MessageActionRow, MessageButton } from "discord.js";
import { Question } from "../util/types";
export function leaderboardButtons(
  currentPage: number,
  prevPage: boolean,
  nextPage: boolean
): MessageActionRow {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`page_${currentPage - 2}`)
      .setEmoji("⏪")
      .setDisabled(!prevPage)
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(`page_${currentPage--}`)
      .setEmoji("⬅️")
      .setDisabled(!prevPage)
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(`page_${currentPage++}`)
      .setEmoji("➡️")
      .setDisabled(!nextPage)
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(`page_${currentPage + 2}`)
      .setEmoji("⏩")
      .setDisabled(!nextPage)
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
