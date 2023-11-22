import { Client, CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import { setTimeout } from "timers/promises";
import { writeFile } from "fs";
import { formatDate } from "../utils";
import _ from "lodash";
import { GUNAYDIN_CHANNEL_ID } from "../utils/constants";

type Message = {
  author: string;
  content: string;
  uid: string;
  createdAt: string;
};

async function fetchMessages(client: Client, channelID: string, N_DAYS_AGO = 7) {
  const channel = (await client.channels.fetch(channelID)) as TextChannel; // Replace with your channel ID
  const today = new Date();
  const endDate = new Date(today.getTime() - N_DAYS_AGO * 24 * 60 * 60 * 1000);
  endDate.setHours(0, 0, 0, 0);
  const endTime = endDate.getTime();

  let lastId: string | undefined;
  let messagesCollected: Message[] = [];

  while (true) {
    const messages = await channel.messages.fetch({
      limit: 100,
      before: lastId,
    });

    // Stop if no more messages are retrieved
    if (messages.size === 0) {
      console.log("No more messages to fetch.");
      break;
    }

    // Filter and collect messages
    const filteredMessages = messages.filter((m) => m.createdTimestamp > endTime);
    filteredMessages.toJSON().forEach((m) =>
      messagesCollected.push({
        author: m.author.username,
        content: m.content,
        uid: m.author.id,
        createdAt: formatDate(m.createdTimestamp),
      })
    );

    // Break if no messages in the current fetch are within the time range
    if (filteredMessages.size === 0) {
      writeToFile(messagesCollected);
      const grouped = _.groupBy(messagesCollected, "uid");
      writeToFile(grouped, "grouped.json");
      return messagesCollected;
    }

    // Update lastId for the next iteration
    lastId = messages.lastKey();
    console.log(messagesCollected.length, "messages collected so far.");

    await setTimeout(1000); // Respect rate limits
  }

  console.log("Finished fetching messages.");
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
    .setDescription("Fetches messages from a channel"),
  async execute(interaction: CommandInteraction) {
    const client = interaction.client;
    const channelID = GUNAYDIN_CHANNEL_ID;
    const messages = await fetchMessages(client, channelID, 14);
  },
};

export default getMessages;
