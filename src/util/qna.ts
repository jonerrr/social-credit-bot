import { Question, Quiz } from "./types";

export const popQuestions: Question[] = [
  { question: "What is the best country?", answers: ["china"] },
  {
    question: "Who is the best leader?",
    answers: ["xi", "xi jingping", "jingping"],
  },
  { question: "Is taiwan a real country?", answers: ["no", "nope"] },
];

export const questions: Quiz[] = [
  { question: "Is taiwan part of china?", answers: ["Yes", "No"], correct: 0 },
  { question: "Is taiwan a real country?", answers: ["Yes", "No"], correct: 1 },
  {
    question: "Does china have concentration camps filled with muslims?",
    answers: ["yes", "no"],
    correct: 0,
  },
  {
    question: "What happened on June 4th?",
    answers: ["Tiananmen Square protests", "Internet Maintnence day"],
    correct: 1,
  },
  {
    question: "How long can you play video games for?",
    answers: ["10 seconds", "5 hours", "3 hours"],
    correct: 2,
  },
  {
    question: "What is the best place ever?",
    answers: ["America", "China", "Britian"],
    correct: 1,
  },
  {
    question:
      "Will you donate your village to the CCP for nuclear warhead testing?",
    answers: ["Yes", "No"],
    correct: 0,
  },
  {
    question: "What is the best phone ever?",
    answers: ["Iphone 13", "Samsung S21", "Huawei P50"],
    correct: 1,
  },
];
