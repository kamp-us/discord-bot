import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import { setTimeout } from "timers/promises";
import { writeFile } from "fs";

async function fetchMessages(client, channelID, N_DAYS_AGO = 7) {
  const channel = (await client.channels.fetch(channelID)) as TextChannel; // Replace with your channel ID
  const endTime = Date.now() - N_DAYS_AGO * 24 * 60 * 60 * 1000;

  let lastId: string | undefined;
  let count = 0;

  while (true) {
    const messages = await channel.messages.fetch({
      limit: 100, // Adjust as needed
      before: lastId,
    });
    const filteredMessages = messages.filter((m) => m.createdTimestamp > endTime);
    const allMessages = {};

    // Process the messages here
    filteredMessages.forEach((message) => {
      allMessages[message.author.tag] = { content: message.content, uid: message.author.id };
    });
    const timestamp = filteredMessages.last()?.createdTimestamp as number;

    if (filteredMessages.size < 100 || messages.size === 0 || timestamp <= endTime) {
      break;
    }

    // Save the ID of the last message to paginate
    count += filteredMessages.size;
    lastId = filteredMessages.last()?.id;

    // To handle rate limits, wait before making a new request
    await setTimeout(1000);

    writeFile(`${count}` + ".json", JSON.stringify(allMessages), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("File written successfully\n");
      }
    });
  }

  console.log("Finished fetching messages.");
}

const getMessages = {
  data: new SlashCommandBuilder()
    .setName("get-messages")
    .setDescription("Fetches messages from a channel"),
  async execute(interaction: CommandInteraction) {
    const client = interaction.client;
    const channelID = "1158288028511522877";
    const messages = await fetchMessages(client, channelID);
  },
};

export default getMessages;
