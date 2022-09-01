import { Guild, User } from "discord.js";
import { servers, users } from "../util/model";

export async function check(
  id: string,
  type: "server" | "user",
  target: User | Guild
): Promise<{ sentiment: boolean; quiz: boolean; cooldown?: number }> {
  let data =
    type === "server"
      ? await servers.findOne({ _id: id })
      : await users.findOne({ _id: id });

  if (!data) {
    data =
      type === "server"
        ? await new servers({
            _id: target.id,
            sentiment: true,
            popQuiz: true,
          }).save()
        : await new users({
            _id: target.id,
            //@ts-ignore
            username: target.username,
            credit: 0,
            sentiment: true,
            popQuiz: true,
          }).save();
  }

  return {
    sentiment:
      data.sentiment && typeof data.sentiment === "boolean"
        ? data.sentiment
        : true,
    quiz: typeof data.popQuiz === "boolean" ? data.popQuiz : true,
    cooldown: data.cooldown,
  };
}
