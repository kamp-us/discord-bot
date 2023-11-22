import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { writeFile } from "fs";
import { GUILD_ID } from "../../config";

type Member = {
  username: string;
  uid: string;
  joinedAt?: string;
};

export async function fetchAllMembers(client: Client, guildID: string) {
  const guild = client.guilds.cache.get(guildID); // Replace with your guild ID
  if (!guild) return console.error("Guild not found.");
  let membersCollected: Member[] = [];

  try {
    // Fetching all members
    await guild.members.fetch();

    guild.members.cache.forEach((member) => {
      membersCollected.push({
        username: member.user.username,
        uid: member.user.id,
      });
    });
    console.log("Finished fetching members. Total members:", membersCollected.length);
    writeToFile(membersCollected);
  } catch (error) {
    console.error("Error fetching members:", error);
  }
}

async function writeToFile(members: any) {
  const fileName = `members_${new Date().toUTCString()}${Object.keys(members).length}.json`;
  writeFile(fileName, JSON.stringify(members, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Messages saved to messages.json");
    }
  });
}

const getAllMembers = {
  data: new SlashCommandBuilder()
    .setName("get-members")
    .setDescription("Fetches all members of the guild"),
  async execute(interaction: CommandInteraction) {
    const client = interaction.client;
    const channelID = "1158288028511522877";
    const members = await fetchAllMembers(client, GUILD_ID);
  },
};

export default getAllMembers;
