import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export async function assignRole(client: Client, guildID: string, userID: string) {
  const guild = client.guilds.cache.get(guildID); // Replace with your guild ID
  if (!guild) {
    console.error("Guild not found.");
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
    .setDescription("Assignes a role to a user")
    .addUserOption((option) => option.setName("user").setDescription("User to assign role to")),
  async execute(interaction: CommandInteraction) {
    const client = interaction.client;
    const guildID = interaction.guildId;
    if (guildID === null) {
      console.error("Guild ID is null.");
      return;
    }

    const member = interaction.options.getUser("user");

    await assignRole(client, guildID, member?.id ?? "");
    console.log("Finished assigning role.");
  },
};

export default assignRoleCommand;
