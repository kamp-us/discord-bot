import { Message } from "discord.js";

export const isTodayDailyQuestionFound = (messages: Message[], formattedDate: string) => {
  let m: Message<boolean> | undefined;
  const isFound = messages.some((message) => {
    if (message.content.includes("Günün Sorusu") && message.content.includes(formattedDate)) {
      m = message;
      return true;
    }
    return false;
  });

  return [isFound, m] as const;
};
