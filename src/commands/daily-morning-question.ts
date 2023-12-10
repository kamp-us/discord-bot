import {
  Client,
  CommandInteraction,
  Message,
  SlashCommandBuilder,
  TextChannel,
  messageLink,
} from "discord.js";
import { GUNAYDIN_CHANNEL_ID, KAMPUS_GUILD_ID } from "../../config";
import { setTimeout } from "timers/promises";
import { formatDate } from "../utils";
import _ from "lodash";
import { sendWithDefer } from "../../sendWithDefer";

const isMessageFound = (messages: Message[], formattedDate: string) => {
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

const dailyMorningQuestion = {
  data: new SlashCommandBuilder()
    .setName("gunun-sorusu")
    .setDescription("Günün sorusunu oluşturur."),
  async execute(interaction: CommandInteraction) {
    const channel = (await interaction.client.channels.fetch(GUNAYDIN_CHANNEL_ID)) as TextChannel;
    const botId = "967524936551895051";
    const now = new Date();

    const messages = (await fetchMessages(interaction.client, GUNAYDIN_CHANNEL_ID, 1, botId)) || [];
    const options = {
      month: "long",
      day: "numeric",
    } as Intl.DateTimeFormatOptions;
    const formattedDate = new Intl.DateTimeFormat("tr-TR", options).format(now);
    const questionTitle = "Günün Sorusu - " + formattedDate;

    const [isFound, m] = isMessageFound(messages, formattedDate);
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

const getDaysAgo = (n: number) => {
  const today = new Date();
  const endDate = new Date(today.getTime() - n * 24 * 60 * 60 * 1000);
  endDate.setHours(0, 0, 0, 0);
  return endDate.getTime();
};

async function fetchMessages(
  client: Client,
  channelID: string,
  days = 7,
  userID: string | undefined
) {
  const channel = (await client.channels.fetch(channelID)) as TextChannel;
  // get ${days} days ago from today in milliseconds from 00:00:00
  const nDaysAgo = getDaysAgo(days);

  let lastId: string | undefined;
  let messagesCollected: any[] = [];

  while (true) {
    const messages = await channel.messages.fetch({
      limit: 100,
      before: lastId,
    });

    // Stop if no more messages are retrieved
    if (messages.size === 0) {
      // if there are no messages in the chat
      if (messagesCollected.length === 0) {
        console.log("No messages collected.");
        return;
      }
      // if there are no more messages to fetch
      console.log("No more messages to fetch.");
      break;
    }

    // Filter and collect messages
    const filteredMessages = messages.filter((m) => {
      return m.createdTimestamp > nDaysAgo;
    });
    filteredMessages.toJSON().forEach((m) => {
      messagesCollected.push({
        id: m.id,
        guildId: m.guildId,
        channelId: m.channelId,
        author: m.author,
        content: m.content,
        uid: m.author.id,
        createdAt: formatDate(m.createdTimestamp),
      });
    });

    if (filteredMessages.size === 0) {
      const grouped = _.groupBy<Message>(messagesCollected, "uid");
      if (userID) {
        return grouped[userID];
      }
      return grouped as unknown as Message[];
    }

    // Update lastId for the next iteration
    lastId = messages.lastKey();
    console.log(messagesCollected.length, " messages collected so far.");

    await setTimeout(1000); // Respect rate limits
  }
}
