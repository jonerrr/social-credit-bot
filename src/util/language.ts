import translate from "@vitalets/google-translate-api";

export async function detectLanguage(text: string): Promise<string> {
  const res = await translate(text, { to: "en" });
  return res.from.language.iso;
}
