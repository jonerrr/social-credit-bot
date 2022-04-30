import { User } from "discord.js";
import { users } from "./model";
import { UserModel, Leaderboard } from "./types";
let leaderboardCache: UserModel[];
let cacheExpire: Number = Date.now();

export async function update(author: User, amount: number): Promise<number> {
  const data = await users.findById(author.id);

  if (!data) {
    await new users({
      _id: author.id,
      username: author.username,
      credit: amount,
    }).save();
    return amount;
  }

  await users.updateOne(
    { _id: author.id },
    { username: author.username, credit: data.credit + amount }
  );
  return data.credit + amount;
}

export async function lookup(id: string): Promise<number | null> {
  const credits: UserModel | null = await users.findById(id);

  return !!credits ? credits.credit : null;
}

function paginate(lb: UserModel[], pageNumber: number): UserModel[] {
  return lb.slice((pageNumber - 1) * 10, pageNumber * 10);
}

export async function leaderboard(page: number): Promise<Leaderboard> {
  if (!leaderboardCache || cacheExpire < Date.now()) {
    const data: UserModel[] = await users.find();
    leaderboardCache = data.sort((a, b) => a.credit - b.credit);
    cacheExpire = Date.now() + 300000;
  }

  return {
    users: paginate(leaderboardCache, page),
    maxPages: leaderboardCache.length / 10,
  };
}

export function generateCredits(sentiment: string, good: boolean): number {
  switch (good ? sentiment.toLowerCase() : !good) {
    case "negative":
      return Math.floor(Math.random() * (-100 - 75)) - 75;
    case "positive":
      return Math.floor(Math.random() * (100 - 75)) + 75;
    default:
      return Math.floor(Math.random() * (10 + -10)) + -20;
  }
}
