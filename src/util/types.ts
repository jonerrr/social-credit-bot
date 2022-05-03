import { MessageSelectOptionData } from "discord.js";

export interface Word {
  word: string;
  good: boolean;
}
export interface Question {
  question: string;
  answers: string[];
}

export interface Quiz {
  question: string;
  answers: MessageSelectOptionData[];
}

export interface UserModel {
  _id: string;
  username: string;
  credit: number;
}

export interface Leaderboard {
  users: UserModel[];
  nextPage: boolean;
  prevPage: boolean;
}
