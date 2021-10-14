import { User } from "discord.js";

export const comprehendCooldown: Set<string> = new Set();
export const quizCooldown: Set<string> = new Set();
export const quizUsers: Set<User> = new Set();
