import { Message } from "discord.js";

export const isTodayDailyQuestionFound = (messages: Message[]) => {
  const gununSorusuAll = messages.filter((message) => message.content.includes("Günün Sorusu"));
  const message = gununSorusuAll[0];

  if (!message) {
    return [false, undefined, 0] as const;
  }

  const count = message.content.split("-")[1].trim();
  // createdAt thinks it's a Date but in reality it's a string
  const day = (message.createdAt as unknown as string).split(" ")[0];
  const isFound = day === new Date().getDate().toString();

  return [isFound, message, parseInt(count) + 1] as const;
};
