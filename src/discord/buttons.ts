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
