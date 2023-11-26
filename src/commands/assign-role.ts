import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import members from "../../grouped.json";

export async function assignRole(client: Client, guildID: string, userID: string) {
  const guild = client.guilds.cache.get(guildID); // Replace with your guild ID
  if (!guild) return console.error("Guild not found.");
  if (!members) {
    console.error("You should run get-all-members first");
    return;
  }

  try {
    const role = guild.roles.cache.find((r) => r.name === "v2"); // Replace with the role name
    if (!role) return console.error("Role not found.");

    const member = guild.members.cache.get(userID); // Replace with the user's ID
    if (!member) return console.error("Member not found.", userID);

    await member.roles.add(role);
    console.log(`Role ${role.name} added to ${member.user.tag}`);
  } catch (error) {
    console.error("Error assigning role:", error);
  }
}

const assignRoleCommand = {
  data: new SlashCommandBuilder()
    .setName("assign-role")
    .setDescription("Assignes a role to a user"),
  async execute(interaction: CommandInteraction) {
    const client = interaction.client;
    const guildID = interaction.guildId;
    if (guildID === null) return console.error("Guild ID is null.");

    for (const member of Object.keys(members)) {
      await assignRole(client, guildID, member);
    }

    console.log("Assigned roles so far: ", Object.keys(members).length);
    console.log("Finished assigning roles.");
  },
};

export default assignRoleCommand;
