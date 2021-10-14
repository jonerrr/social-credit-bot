export interface Question {
  question: string;
  answers: string[];
}

export interface Quiz {
  question: string;
  answers: string[];
  correct: number;
}

export interface UserModel {
  _id: string;
  username: string;
  credit: number;
}

export interface Leaderboard {
  users: UserModel[];
  maxPages: number;
}
