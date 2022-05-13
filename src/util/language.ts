import translate from "@vitalets/google-translate-api";
import { Nodehun } from "nodehun";
import { readFileSync } from "fs";

const affix = readFileSync("./dictionary/en_US.aff");
const dictionary = readFileSync("./dictionary/en_US.dic");
const nodehun = new Nodehun(affix, dictionary);

export async function detectLanguage(text: string): Promise<string> {
  const res = await translate(text, { to: "en" });
  return res.from.language.iso;
}

export async function correctSpelling(words: string[]): Promise<string> {
  let correct = "";
  for (const word of words) {
    const suggestions = await nodehun.suggest(word);
    suggestions
      ? (correct = `${correct} ${suggestions[0]}`)
      : (correct = `${correct} ${word}`);
  }
  return correct;
}
