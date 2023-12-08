import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { writeFile } from "fs";

type Member = {
  username: string;
  uid: string;
  joinedAt?: string;
  roles: string[];
};

export async function fetchAllMembers(client: Client, guildID: string) {
  const guild = client.guilds.cache.get(guildID); // Replace with your guild ID
  if (!guild) {
    console.error("Guild not found.");
    return;
  }
  let membersCollected: Member[] = [];

  try {
    // Fetching all members
    await guild.members.fetch();

    guild.members.cache.forEach((member) => {
      membersCollected.push({
        username: member.user.username,
        uid: member.user.id,
        roles: member.roles.cache.map((role) => role.name),
      });
    });
    console.log("Finished fetching members. Total members:", membersCollected.length);
    writeToFile(membersCollected);
  } catch (error) {
    console.error("Error fetching members:", error);
  }
}

function writeToFile(
  members: any,
  fileName = `members_${new Date().toUTCString()}${Object.keys(members).length}.json`
) {
  writeFile(fileName, JSON.stringify(members, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Messages saved to " + fileName);
    }
  });
}

const getAllMembers = {
  data: new SlashCommandBuilder()
    .setName("get-members")
    .setDescription("Fetches all members of the guild"),
  async execute(interaction: CommandInteraction) {
    const client = interaction.client;
    const guildID = interaction.guildId;
    if (guildID === null) {
      console.error("Guild ID is null.");
      return;
    }

    const members = await fetchAllMembers(client, guildID);
  },
};

export default getAllMembers;
