import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
// @ts-ignore
import members from "../../grouped.json" assert { type: "json" };

const recycleV2Roles = {
  data: new SlashCommandBuilder()
    .setDescription("Recycle v2 roles. Before running this command run get-messages")
    .setName("recycle-v2-roles"),
  async execute(interaction: CommandInteraction) {
    const { guild } = interaction;
    if (!guild) return;

    const rolesToDelete = guild.roles.cache.find((role) => role.name.startsWith("v2"));
    if (!rolesToDelete) {
      console.error("Role not found.");
      return;
    }
    // find all members with v2 role
    const membersWithV2Role = guild.members.cache.filter((member) =>
      member.roles.cache.some((role) => role.name.startsWith("v2"))
    );

    // remove v2 role from members who are not in the grouped.json file
    let count = 0;
    let removedUsers: String[] = [];
    membersWithV2Role.forEach((member) => {
      const memberData = members[member.user.id];
      if (!memberData) {
        console.log(`Removing v2 role from ${member.user.tag}`);
        member.roles.remove(rolesToDelete);
        removedUsers.push(member.user.tag);
        count++;
      }
    });

    const channel = interaction.client.channels.cache.get(
      process.env.GIDENLER_CHANNEL_ID ?? ""
    ) as TextChannel;
    if (!channel) return;
    await channel.send(
      `Done. ${count} members were removed from v2 role. These are removed users: ${removedUsers.map(
        (user) => {
          return `\n${user}`;
        }
      )}`
    );
  },
};

export default recycleV2Roles;
