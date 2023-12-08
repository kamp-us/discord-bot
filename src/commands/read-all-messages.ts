import { Client, CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import { setTimeout } from "timers/promises";
import { writeFile } from "fs";
import { formatDate } from "../utils";
import _, { get } from "lodash";
import { GUNAYDIN_CHANNEL_ID } from "../../config";

type Message = {
  author: string;
  content: string;
  uid: string;
  createdAt: string;
};

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
  let messagesCollected: Message[] = [];

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
    filteredMessages.toJSON().forEach((m) =>
      messagesCollected.push({
        author: m.author.username,
        content: m.content,
        uid: m.author.id,
        createdAt: formatDate(m.createdTimestamp),
      })
    );

    if (filteredMessages.size === 0) {
      const grouped = _.groupBy(messagesCollected, "uid");
      if (userID) {
        const options = {
          month: "long",
          day: "numeric",
        };
        const formattedDate = new Intl.DateTimeFormat("tr-TR", {
          month: "2-digit",
          year: "2-digit",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }).format(new Date());
        writeToFile(
          grouped[userID],
          `./messages/u:${userID}-c:${channelID}-a:${days}-d:${formattedDate}.json`
        );
        return grouped[userID];
      }
      writeToFile(grouped, "grouped.json");
      return grouped;
    }

    // Update lastId for the next iteration
    lastId = messages.lastKey();
    console.log(messagesCollected.length, " messages collected so far.");

    await setTimeout(1000); // Respect rate limits
  }
}

async function writeToFile(
  messages: any,
  fileName = `messages_${new Date().toUTCString()}${Object.keys(messages).length}.json`
) {
  writeFile(fileName, JSON.stringify(messages, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Messages saved to messages.json");
    }
  });
}

const getMessages = {
  data: new SlashCommandBuilder()
    .setName("get-messages")
    .setDescription("Fetches messages from a channel")
    .addChannelOption((option) =>
      option.setName("channel-name").setDescription("channel name").setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("days")
        .setDescription("Number of days to fetch messages from")
        .setRequired(true)
    )
    .addUserOption((option) => option.setName("user-name").setDescription("user name")),
  async execute(interaction: CommandInteraction) {
    const client = interaction.client;
    const channelID = interaction.options.get("channel-name")?.value as string;
    const userID = interaction.options.get("user-name")?.value?.toString();
    const days = interaction.options.get("days")?.value as number;
    const messages = await fetchMessages(client, channelID, days, userID);
  },
};

export default getMessages;
