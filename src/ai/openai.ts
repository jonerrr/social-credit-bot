import { Configuration, OpenAIApi } from "openai";
import { Message } from "discord.js";
import { generateCredits, update } from "../util/credit";
import { generateReply } from "../discord/embed";
import config from "../../config.json";
import { SimpleConsoleLogger } from "typeorm";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: config.ai.openai,
  })
);

export async function classifySentiment(
  message: Message,
  good: boolean
): Promise<void> {
  const sentiment = await openai.createCompletion("text-curie-001", {
    prompt: `If there is an error in the grammar of this statement fix it and then classify the sentiment of the statement as "positive" or "negative":\n${message.content}`,
    temperature: 0.7,
    max_tokens: 69,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  console.log(sentiment.data.choices[0].text);
  console.log(sentiment.data.choices[0].text.replace(/\s+/g, ""));

  let score = generateCredits(
    sentiment.data.choices[0].text.includes("positive")
      ? "positive"
      : "negative"
  );

  score = good ? score : -score;
  console.log(score);

  await message.channel.send({
    embeds: [generateReply(score, await update(message.author, score))],
  });
}
