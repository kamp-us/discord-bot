import _ from "lodash";
import {
  CommandInteraction,
  Message,
  SlashCommandBuilder,
  TextChannel,
  messageLink,
} from "discord.js";
import { fetchMessages } from "../features/fetch-messages";
import { isTodayDailyQuestionFound } from "../features/is-daily-msg-exist";

const dailyMorningQuestion = {
  data: new SlashCommandBuilder()
    .setName("gunun-sorusu")
    .setDescription("Creates 'Günün sorusu' thread.")
    .addNumberOption((option) => option.setName("count").setDescription("Günün sorusu sayısı")),
  async execute(interaction: CommandInteraction) {
    if (!process.env.GUNAYDIN_CHANNEL_ID) {
      throw new Error("GUNAYDIN_CHANNEL_ID environment variable is not set.");
    }

    const channel = (await interaction.client.channels.fetch(
      process.env.GUNAYDIN_CHANNEL_ID ?? ""
    )) as TextChannel;
    const botId = "1183616536682958899";

    let messages = (await fetchMessages(
      interaction.client,
      process.env.GUNAYDIN_CHANNEL_ID,
      1,
      botId
    )) as Message[];

    if (!messages) {
      console.log("No messages found sent by the bot.");
      messages = [];
    }

    const [isFound, m, c] = isTodayDailyQuestionFound(messages);
    const count = (interaction.options.get("count")?.value as number) ?? c;

    if (isFound && m) {
      await interaction.deferReply({
        ephemeral: true,
      });
      await interaction.editReply({
        content: `Günün sorusu zaten oluşturulmuş! ${messageLink(
          m.channelId,
          m.id,
          m.guildId ?? ""
        )}`,
      });
    } else {
      const questionTitle = `Günün Sorusu - ${count}`;
      const threadMention = buildDailyMorningQuestion(channel, questionTitle);
      await interaction.deferReply({
        ephemeral: true,
      });
      await interaction.editReply({
        content: `Günün sorusu başarıyla oluşturuldu! Thread icin: ${threadMention}`,
      });
    }
  },
};

export default dailyMorningQuestion;

const buildDailyMorningQuestion = async (channel: TextChannel, questionTitle: string) => {
  const thread = await channel.threads.create({
    name: questionTitle,
  });

  const geyik = `<:geyik:1161771822350602260>`;
  const threadMention = `<#${thread.id}>`;
  const message = await channel.send(threadMention);
  const threadMessage = await thread.send(
    `Volkan abi ve geyikler günün sorusunu soruyor!\n ${geyik} ${geyik} ${geyik} ${geyik} ${geyik} ${geyik}`
  );
  const messagePin = await message.pin();
  Promise.all([threadMessage, messagePin, message]);

  return threadMention;
};
