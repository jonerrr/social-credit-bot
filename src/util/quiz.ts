import { Message } from "discord.js";
import { generateError, generateReply } from "../discord/embed";
import { update } from "./credit";
import { Question } from "./types";

export function popQuiz(collector: any, question: Question, author: User) {
  let tries = 3;
  collector.on("collect", async (message: Message) => {
    if (tries < 1) {
      const score = Math.floor(Math.random() * (-100 - 75)) - 75;
      message.reply({
        embeds: [generateReply(score, await update(author, score))],
      });
    }

    for (const word of question.answers) {
      if (!message.content.toLowerCase().includes(word) && tries > 0) {
        tries--;
        message.reply({ embeds: [generateError(`WRONG! ${tries} left.`)] });
        break;
      }

      const score = Math.floor(Math.random() * (100 - 75)) + 75;

      message.reply({
        embeds: [generateReply(score, await update(author, score))],
      });
    }
  });

  collector.on("end", (collected) => {});
}
