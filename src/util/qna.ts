import { Question, Quiz } from "./types";

export const popQuestions: Question[] = [
  { question: "What is the best country?", answers: ["china"] },
  {
    question: "Who is the best leader?",
    answers: ["xi", "xi jingping", "jingping"],
  },
  { question: "Is taiwan a real country?", answers: ["no", "nope"] },
  {
    question: "Long live...",
    answers: ["the ccp", "the china communist party", "china"],
  },
];

export const questions: Quiz[] = [
  {
    question: "Is Taiwan part of China?",
    answers: [
      { label: "Yes", value: "c" },
      { label: "No", value: "i" },
    ],
  },
  {
    question: "Is Taiwan a real country?",
    answers: [
      { label: "Yes", value: "i" },
      { label: "No", value: "c" },
    ],
  },
  {
    question: "Does China have concentration camps filled with muslims?",
    answers: [
      { label: "Yes", value: "i" },
      { label: "No", value: "c" },
    ],
  },
  {
    question: "What happened on June 4th?",
    answers: [
      { label: "Tiananmen Square protests", value: "i" },
      { label: "Internet Maintnence day", value: "c" },
    ],
  },
  {
    question: "How long can you play video games for?",
    answers: [
      { label: "1 hour a week", value: "i1" },
      { label: "3 hours a week", value: "c" },
      { label: "5 hours a week", value: "i2" },
    ],
  },
  {
    question: "What is the best place ever?",
    answers: [
      { label: "America", value: "i1" },
      { label: "Britain", value: "i2" },
      { label: "China", value: "c" },
    ],
  },
  {
    question:
      "Will you donate your village to the CCP for nuclear warhead testing?",
    answers: [
      { label: "Yes", value: "c" },
      { label: "No", value: "i" },
    ],
  },
  {
    question: "What is the best phone ever?",
    answers: [
      { label: "Iphone 13", value: "i1" },
      { label: "Samsung S21", value: "i2" },
      { label: "Huawei P50", value: "c" },
    ],
  },
  {
    question: "How is your day going?",
    answers: [
      { label: "Great! I love China! Long live the CCP!", value: "c" },
      { label: "Not sure", value: "i1" },
      { label: "Bad", value: "i2" },
    ],
  },
];
