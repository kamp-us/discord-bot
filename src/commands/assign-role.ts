import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
// @ts-ignore
import members from "../../grouped.json" assert { type: "json" };

export async function assignRole(client: Client, guildID: string, userID: string) {
  const guild = client.guilds.cache.get(guildID); // Replace with your guild ID
  if (!guild) {
    console.error("Guild not found.");
    return;
  }
  if (!members) {
    console.error("You should run get-all-members first");
    return;
  }

  try {
    const role = guild.roles.cache.find((r) => r.name === "v2"); // Replace with the role name
    if (!role) {
      console.error("Role not found.");
      return;
    }

    const member = guild.members.cache.get(userID); // Replace with the user's ID
    if (!member) {
      console.error("Member not found.");
      return;
    }

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
    if (guildID === null) {
      console.error("Guild ID is null.");
      return;
    }

    for (const member of Object.keys(members)) {
      await assignRole(client, guildID, member);
    }

    console.log("Assigned roles so far: ", Object.keys(members).length);
    console.log("Finished assigning roles.");
  },
};

export default assignRoleCommand;
