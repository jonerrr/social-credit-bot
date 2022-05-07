import { servers, users } from "../util/model";

export async function check(
  id: string,
  type: "server" | "user"
): Promise<{ sentiment: boolean; quiz: boolean }> {
  const data =
    type === "server"
      ? await servers.findOne({ _id: id })
      : await users.findOne({ _id: id });

  return {
    sentiment: typeof data.sentiment === "boolean" ? data.sentiment : true,
    quiz: typeof data.popQuiz === "boolean" ? data.popQuiz : true,
  };
}
