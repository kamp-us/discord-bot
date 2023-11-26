import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { writeFile } from "fs";
import * as _ from "lodash";

type Member = {
  username: string;
  uid: string;
  joinedAt?: string;
  roles: string[];
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
        roles: member.roles.cache.map((role) => role.name),
      });
    });
    console.log("Finished fetching members. Total members:", membersCollected.length);
    writeToFile(membersCollected);
    writeToFile(_.groupBy(membersCollected, "uid"), "grouped.json");
  } catch (error) {
    console.error("Error fetching members:", error);
  }
}

async function writeToFile(
  members: any,
  fileName = `members_${new Date().toUTCString()}${Object.keys(members).length}.json`
) {
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
    const guildID = interaction.guildId;
    if (guildID === null) return console.error("Guild ID is null.");

    const members = await fetchAllMembers(client, guildID);
  },
};

export default getAllMembers;
