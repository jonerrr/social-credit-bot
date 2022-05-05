import { UserModel } from "../util/types";
import { MessageEmbed } from "discord.js";
import {
  creditsGained,
  creditsGainedMore,
  creditsLost,
  creditsInNegative,
  positiveAttachments,
  negativeAttachments,
} from "../util/phrases";

export function generateReply(score: number, current: number): MessageEmbed {
  let phrase: string =
    creditsGained[Math.floor(Math.random() * creditsGained.length)];

  if (current > 10000 && score > 0 && Math.floor(Math.random() * 2) === 1)
    phrase =
      creditsGainedMore[Math.floor(Math.random() * creditsGainedMore.length)];
  if (score < 0 && current > 0)
    phrase = creditsLost[Math.floor(Math.random() * creditsLost.length)];
  if (score < 0 && current < 0)
    phrase =
      creditsInNegative[Math.floor(Math.random() * creditsInNegative.length)];

  const embed = new MessageEmbed()
    .setTitle(
      score > 0
        ? ":flag_cn: Great job comrade :flag_cn:"
        : ":rage::flag_cn: Bad work comrade :rage::face_with_symbols_over_mouth:"
    )
    .setDescription(phrase.replace("_", score.toString()))
    .setColor(score > 0 ? "GREEN" : "DARK_RED")
    .setFooter({ text: `Total Social Credits: ${current}` });

  if (Math.floor(Math.random() * 10) === 5)
    embed.setImage(
      score > 0
        ? positiveAttachments[
            Math.floor(Math.random() * positiveAttachments.length)
          ]
        : negativeAttachments[
            Math.floor(Math.random() * negativeAttachments.length)
          ]
    );

  return embed;
}

export function generateCredit(
  username: string,
  credits: number | null,
  author: boolean
): MessageEmbed {
  if (!credits || !username)
    return generateError(
      author
        ? `You are not part of the great republic.`
        : `This user is not part of the great republic (for now).`
    );

  return new MessageEmbed()
    .setFooter({
      text: `${
        author
          ? `You have ${credits} credits.`
          : `Your fellow comrade, ${username} has ${credits} credits.`
      }`,
    })
    .setColor("RANDOM");
}

export function generateLeaderboard(
  scores: UserModel[],
  currentPage: number
): MessageEmbed {
  const embed = new MessageEmbed()
    .setTitle("Social Credit Leaderboard")
    .setFooter({ text: `Page: ${currentPage}` })
    .setColor("RANDOM");
  scores.forEach((s) =>
    embed.addField(s.username, `${s.credit.toString()} credits`)
  );
  return embed;
}

export function generatePopQuestion(question: string): MessageEmbed {
  return new MessageEmbed()
    .setTitle("Citizen Test")
    .setDescription(
      `Hello fellow citizen please answer this question within 2 minutes to avoid the death penalty.\n\n*${question}**`
    )
    .setColor("RANDOM");
}

export function generateQuizQuestion(
  question: string,
  currentQuestion: number,
  username: string
): MessageEmbed {
  return new MessageEmbed()
    .setTitle(`Question ${currentQuestion + 1}/3`)
    .setDescription(question)
    .setFooter({ text: `Requested by ${username}` })
    .setColor("RANDOM");
}

export function settings(type: "User" | "Guild"): MessageEmbed {
  return new MessageEmbed()
    .setTitle(`Manage ${type} Settings`)
    .setDescription(
      `Sentiment --- Increase/Decrease credit score based off of sentiment in messages\nPop Quiz --- Pop quizzes will randomly show up ${
        type === "User" ? "for you" : "in chat"
      }\n\n🟩 === Enabled\n🟥 === Disabled`
    );
}

export function generateError(message: string): MessageEmbed {
  return new MessageEmbed()
    .setTitle(`Error`)
    .setColor("DARK_RED")
    .setFooter({ text: message });
}
