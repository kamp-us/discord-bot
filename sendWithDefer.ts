import { setTimeout as wait } from "node:timers/promises";

export const sendWithDefer = async (interaction, waitTime, message) => {
  await interaction.deferReply();
  await wait(waitTime);
  await interaction.editReply(message);
};
