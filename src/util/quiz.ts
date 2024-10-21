import { Message, User, MessageCollector } from "discord.js";
import { generateError, generateReply } from "../discord/embed";
import { update } from "./credit";
import { Question } from "./types";
import { sentimentCooldown } from "../discord/cooldown";

export function popQuiz(
  collector: MessageCollector,
  question: Question,
  author: User,
  message: Message
) {
  let tries = 3;
  // let start = Date.now();

  collector.on("collect", async (message) => {
    // if (start > Date.now()) {
    //   const score = Math.floor(Math.random() * (-100 - 75)) - 75;

    //   message.channel.send({
    //     content: `<@${author.id}>`,
    //     embeds: [generateReply(score, await update(author, score))],
    //   });
    //   return;
    // }

    if (message.author.id !== author.id) return;

    if (tries <= 1) {
      const score = Math.floor(Math.random() * (-100 - 75)) - 75;
      message.reply({
        embeds: [generateReply(score, await update(author, score))],
      });
      collector.stop("tries");
      return;
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

      collector.stop("correct");
      break;
    }
  });

  collector.on("end", async (_, reason) => {
    sentimentCooldown.delete(author.id);

    if (reason === "time") {
      const score = Math.floor(Math.random() * (-100 - 75)) - 75;
      await message.channel.send({
        content: `<@${message.author.id}>`,
        embeds: [generateReply(score, await update(message.author, score))],
      });
    }
  });
}
