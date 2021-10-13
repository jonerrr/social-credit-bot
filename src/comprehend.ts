import {
  ComprehendClient,
  BatchDetectSentimentCommand,
  SentimentScore,
} from "@aws-sdk/client-comprehend";
import { Chance } from "chance";
import { Message } from "discord.js";
import { update } from "./credit";
import { generateReply } from "./embed";

const chance = new Chance();

const client = new ComprehendClient({ region: "us-east-1" });

export async function comprehend(message: Message): Promise<void> {
  const data = await client.send(
    new BatchDetectSentimentCommand({
      LanguageCode: "en",
      TextList: [message.content.toLowerCase()],
    })
  );

  if (
    !data.ResultList ||
    !data.ResultList[0].SentimentScore ||
    !data.ResultList[0].Sentiment
  )
    return;

  const score = generateCredit(
    data.ResultList[0].Sentiment,
    data.ResultList[0].SentimentScore
  );

  await message.channel.send({
    embeds: [generateReply(score, await update(message.author, score))],
  });

  return;
}

function generateCredit(sentiment: string, scores: SentimentScore): number {
  switch (sentiment) {
    case "NEGATIVE":
      return Math.floor(
        //@ts-ignore
        chance.integer({ min: 75, max: 100 }) * -scores.Negative
      );
    case "POSITIVE":
      return Math.floor(
        //@ts-ignore
        chance.integer({ min: 75, max: 100 }) * scores.Positive
      );
    case "NEUTRAL":
      //@ts-ignore
      return Math.floor(chance.integer({ min: 25, max: 50 }) * scores.Neutral);
    case "MIXED":
      //@ts-ignore
      return Math.floor(chance.integer({ min: 25, max: 50 }) * scores.Mixed);
  }

  return 0;
}
