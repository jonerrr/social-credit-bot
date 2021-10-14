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
    leaderboardCache = await users.find().sort("desc");
    cacheExpire = Date.now() + 300000;
  }

  return {
    users: paginate(leaderboardCache, page),
    maxPages: leaderboardCache.length / 10,
  };
}
