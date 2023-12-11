import _ from "lodash";
import { CommandInteraction, SlashCommandBuilder, TextChannel, messageLink } from "discord.js";
import { fetchMessages } from "../features/fetch-messages";
import { isTodayDailyQuestionFound } from "../features/is-daily-msg-exist";

const dailyMorningQuestion = {
  data: new SlashCommandBuilder()
    .setName("gunun-sorusu")
    .setDescription("Günün sorusunu oluşturur."),
  async execute(interaction: CommandInteraction) {
    const channel = (await interaction.client.channels.fetch(
      process.env.GUNAYDIN_CHANNEL_ID ?? ""
    )) as TextChannel;
    const botId = "967524936551895051";
    const now = new Date();

    const messages =
      (await fetchMessages(interaction.client, process.env.GUNAYDIN_CHANNEL_ID ?? "", 1, botId)) ||
      [];
    const options = {
      month: "long",
      day: "numeric",
    } as Intl.DateTimeFormatOptions;
    const formattedDate = new Intl.DateTimeFormat("tr-TR", options).format(now);
    const questionTitle = `Günün Sorusu - ${formattedDate}`;

    const [isFound, m] = isTodayDailyQuestionFound(messages, formattedDate);
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
