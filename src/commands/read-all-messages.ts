import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import _ from "lodash";
import { fetchMessages } from "../features/fetch-messages";
import { writeToFile } from "../utils";

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
    // typing with as since they are required by the command
    const channelID = interaction.options.get("channel-name")?.value as string;
    const days = interaction.options.get("days")?.value as number;
    const userID = interaction.options.get("user-name")?.value?.toString();
    const messages = await fetchMessages(client, channelID, days, userID);
    let fileName = "grouped.json";

    if (userID) {
      const formattedDate = new Intl.DateTimeFormat("tr-TR", {
        month: "2-digit",
        year: "2-digit",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(new Date());
      fileName = `./u:${userID}-c:${channelID}-a:${days}-d:${formattedDate}.json`;
    }

    const [saved, err] = await writeToFile(messages, fileName);
    if (saved) {
      console.log(`Messages are written to ${saved}`);
    } else {
      console.log(err);
    }
  },
};

export default getMessages;
