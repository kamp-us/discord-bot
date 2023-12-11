import { Client, TextChannel, Message } from "discord.js";
import { formatDate } from "../utils";

const getDaysAgo = (n: number) => {
  const today = new Date();
  const endDate = new Date(today.getTime() - n * 24 * 60 * 60 * 1000);
  endDate.setHours(0, 0, 0, 0);
  return endDate.getTime();
};

export async function fetchMessages(
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
