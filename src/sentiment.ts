import OpenAI, { Completion } from "openai-api";
import { Chance } from "chance";
import { Message } from "discord.js";
import config from "../config.json";

const openAi = new OpenAI(config.key);

export async function classifySentiment(message: Message): Promise<void> {
  const sentiment: Completion = await openAi.complete({
    engine: "curie",
    prompt: message.content,
    maxTokens: 60,
    temperature: 0.3,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
  });

  console.log(sentiment.data);
}

// function generateCredit(sentiment: string, scores: SentimentScore): number {
//     // if (!scores.Mixed || !scores.Negative || !scores.Neutral || !scores.Positive)
//     //   return 0;
//     switch (sentiment) {
//       case "NEGATIVE":
//         return Math.floor(
//           //@ts-ignore
//           chance.integer({ min: 75, max: 100 }) * -scores.Negative
//         );
//       case "POSITIVE":
//         return Math.floor(
//           //@ts-ignore
//           chance.integer({ min: 75, max: 100 }) * scores.Positive
//         );
//       case "NEUTRAL":
//         return Math.floor(
//           //@ts-ignore
//           chance.integer({ min: 25, max: 50 }) * scores.Neutral
//         );
//     }

//     return 0;
//   }
