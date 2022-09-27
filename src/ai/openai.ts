import { Configuration, OpenAIApi } from "openai";
import { Message } from "discord.js";
import { generateCredits, update } from "../util/credit";
import { generateReply } from "../discord/embed";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_KEY!,
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

  let score = generateCredits(
    sentiment.data.choices[0].text.includes("positive")
      ? "positive"
      : "negative"
  );
  score = good ? score : -score;
  await message.channel.send({
    embeds: [generateReply(score, await update(message.author, score))],
  });
}
