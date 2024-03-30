import { Client, TextChannel, Message } from "discord.js";
import { formatDate } from "../utils";
import { setTimeout } from "timers/promises";
import _ from "lodash";

const MESSAGE_FETCH_LIMIT = 100;

const getDaysAgo = (n: number) => {
  const today = new Date();
  const endDate = new Date(today.getTime() - n * 24 * 60 * 60 * 1000);
  endDate.setHours(0, 0, 0, 0);
  return endDate.getTime();
};

const fetchMessagesFromChannel = async (channel: TextChannel, beforeId?: string) => {
  try {
    return await channel.messages.fetch({
      limit: MESSAGE_FETCH_LIMIT,
      before: beforeId,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export async function fetchMessages(client: Client, channelID: string, days = 7, userID?: string) {
  try {
    const channel = (await client.channels.fetch(channelID)) as TextChannel;
    const nDaysAgo = getDaysAgo(days);

    let lastId: string | undefined;
    let messagesCollected: any[] = [];

    while (true) {
      const messages = await fetchMessagesFromChannel(channel, lastId);

      if (messages.size === 0) break;

      const countOfOldMessages = messagesCollected.length;

      messages.forEach((m) => {
        if (m.createdTimestamp > nDaysAgo) {
          messagesCollected.push({
            id: m.id,
            guildId: m.guildId,
            channelId: m.channelId,
            author: m.author,
            content: m.content,
            uid: m.author.id,
            createdAt: formatDate(m.createdTimestamp),
          });
        }
      });

      const countOfNewMessages = messagesCollected.length - countOfOldMessages;
      if(countOfNewMessages === 0){
        console.log("No new messages found. Breaking the loop.");
        break;
      }

      // Update lastId for the next iteration
      lastId = messages.lastKey();
      console.log("Last ID:", lastId);
      console.log(messagesCollected.length, " messages collected so far.");

      await setTimeout(3000);
    }

    console.log("Done. Messages collected:", messagesCollected.length);
    const groupedMessages = _.groupBy<Message>(messagesCollected, "uid");
    return userID ? groupedMessages[userID] : groupedMessages;
  } catch (error) {
    console.error("Error in fetchMessages:", error);
    return [];
  }
}
