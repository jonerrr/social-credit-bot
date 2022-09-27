//TODO fix AWS comprehend, it currently doesn't work

import {
  ComprehendClient,
  BatchDetectSentimentCommand,
  SentimentScore,
} from "@aws-sdk/client-comprehend";
import { Message } from "discord.js";
import { generateCredits, update } from "../util/credit";
import { generateReply } from "../discord/embed";
// import { detectLanguage } from "../util/language";

const client = new ComprehendClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export async function comprehend(
  message: Message,
  good: boolean
): Promise<void> {
  // console.log(await detectLanguage(message.content));
  const data = await client.send(
    new BatchDetectSentimentCommand({
      LanguageCode: "en",
      TextList: [message.content.toLowerCase()],
    })
  );
  if (!data.ResultList[0]) return;

  let score = generateCredits(
    data.ResultList[0].Sentiment.toLowerCase() === "neutral"
      ? "positive"
      : data.ResultList[0].Sentiment.toLowerCase()
  );
  score = good ? score : -score;
  await message.channel.send({
    embeds: [generateReply(score, await update(message.author, score))],
  });

  return;
}
