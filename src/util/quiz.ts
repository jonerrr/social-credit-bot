import { Message, User } from "discord.js";
import { generateError, generateReply } from "../discord/embed";
import { update } from "./credit";
import { Question } from "./types";

export function popQuiz(collector: any, question: Question, author: User) {
  let tries = 3;
  let start = Date.now();
  collector.on("collect", async (message: Message) => {
    if (start > Date.now()) {
      const score = Math.floor(Math.random() * (-100 - 75)) - 75;
      return await message.channel.send({
        content: `<@${author.id}>`,
        embeds: [generateReply(score, await update(author, score))],
      });
    }

    if (message.author.id !== author.id) return;

    if (tries <= 1) {
      const score = Math.floor(Math.random() * (-100 - 75)) - 75;
      message.reply({
        embeds: [generateReply(score, await update(author, score))],
      });
      return collector.stop();
    }

    for (const word of question.answers) {
      if (!message.content.toLowerCase().includes(word) && tries > 0) {
        tries--;
        message.reply({
          embeds: [generateError(`🛑😡WRONG! ${tries} tries left.`)],
        });
        break;
      }

      const score = Math.floor(Math.random() * (100 - 75)) + 75;

      message.reply({
        embeds: [generateReply(score, await update(author, score))],
      });

      collector.stop();
      break;
    }
  });
}
