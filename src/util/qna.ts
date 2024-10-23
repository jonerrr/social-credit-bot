import { Question, Quiz } from "./types";

export const popQuestions: Question[] = [
  { question: "What is the best country?", answers: ["china"] },
  {
    question: "Who is the best leader?",
    answers: ["xi", "xi jingping", "jingping"],
  },
  { question: "Is taiwan a real country?", answers: ["no", "nope"] },
  {
    question: "Long live the...",
    answers: [
      "ccp",
      "china communist party",
      "prc",
      "people's republic of china",
    ],
  },
  {
    question: "Who is the founder of the People's Republic of China?",
    answers: ["mao", "mao zedong"],
  },
  {
    question: "How many human right violations does China have?",
    answers: ["0", "zero"],
  },
  {
    question: "Do you accept to be watched with facial recognition 24/7?",
    answers: ["yes", "yep", "yeah", "yup"],
  },
  {
    question: "What happened on June 4th 1989",
    answers: ["nothing", "your mom"],
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
  {
    question: "Does western propaganda exist?",
    answers: [
      { label: "Yes", value: "c" },
      { label: "No", value: "i1" },
    ],
  },
  {
    question: "What is your favorite social media?",
    answers: [
      { label: "Instagram", value: "i" },
      { label: "Twitter", value: "i1" },
      { label: "WeChat", value: "c" },
    ],
  },
  {
    question:
      "How did 45-70 million people die between late 1958 to early 1962",
    answers: [
      { label: "Great leap forward and collectivization", value: "i" },
      { label: "Natural disasters", value: "c" },
    ],
  },
  {
    question: "Who is the richest man in the world?",
    answers: [
      { label: "Elon Musk", value: "i" },
      { label: "Jack Ma", value: "c" },
      { label: "Bernard Arnault", value: "i1" },
    ],
  },
  {
    question: "Who is the premier of China?",
    answers: [
      { label: "Li Qiang", value: "i" },
      { label: "Xi Jingping", value: "i1" },
      { label: "Li Keqiang", value: "c" },
    ],
  },
  {
    question: "Who is the premier of China?",
    answers: [
      { label: "Li Qiang", value: "i" },
      { label: "Xi Jingping", value: "i1" },
      { label: "Li Keqiang", value: "c" },
    ],
  },
  {
    question: "Does the People's Republic of China sponsor mass surveillance campaigns?",
    answers: [
      { label: "Yes", value: "i" },
      { label: "No", value: "c" },
    ],
  },
  {
    question: "What is the best food ever in the world?",
    answers: [
      { label: "Burger", value: "i" },
      { label: "Hot dog (not the animal)", value: "i1" },
      { label: "Peking Duck or dumplings", value: "c" },
    ],
  },
  {
    question: "How long is the Chinese New Year celebration?",
    answers: [
      { label: "5 Days", value: "i" },
      { label: "15 Days", value: "c" },
      { label: "8 Days", value: "i1" }
    ],
  },
];
