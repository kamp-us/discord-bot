import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
// @ts-ignore
import { fetchMessages } from "../features/fetch-messages";
import { client } from "../../createDiscordClient";

const recycleV2Roles = {
  data: new SlashCommandBuilder()
    .setDescription("Recycle v2 roles.")
    .setName("recycle-v2-roles")
    .addBooleanOption((option) => option.setName("dry-run").setDescription("Dry run")),
  async execute(interaction: CommandInteraction) {
    const dryRun = interaction.options.get("dry-run")?.value as boolean;
    const { guild } = interaction;
    if (!guild) {
      console.error("Guild not found.");
      return;
    }

    const roleToDelete = guild.roles.cache.find((role) => role.name.startsWith("v2"));
    if (!roleToDelete) {
      console.error("Role not found.");
      return;
    }
    // find all members with v2 role
    const membersWithV2Role = guild.members.cache.filter((member) =>
      member.roles.cache.has(roleToDelete.id)
    );

    if (!process.env.GUNAYDIN_CHANNEL_ID || !process.env.GIDENLER_CHANNEL_ID) {
      throw new Error("GUNAYDIN_CHANNEL_ID environment variable is not set.");
    }

    const membersWithMessages = await fetchMessages(client, process.env.GUNAYDIN_CHANNEL_ID, 14);

    let count = 0;
    let removedUsers: String[] = [];
    membersWithV2Role.forEach((member) => {
      const memberData = membersWithMessages && membersWithMessages[member.user.id];
      if (!memberData) {
        if (!dryRun) {
          console.log(`Removing v2 role from ${member.user.tag}`);
          member.roles.remove(roleToDelete);
        }
        removedUsers.push(member.user.tag);
        count++;
      }
    });

    const removedUsersList =
      removedUsers.length > 0
        ? `These are returned users: ${removedUsers.map((user) => {
            return `\n${user}`;
          })}`
        : "";

    let message = dryRun
      ? `[DRYRUN] Done. ${count} members will be purged from v2 role.`
      : `Done. ${count} members were removed from v2 role.`;

    const channel = interaction.client.channels.cache.get(
      process.env.GIDENLER_CHANNEL_ID
    ) as TextChannel;
    if (!channel) return;
    await channel.send(`${message} ${removedUsersList}`);
  },
};

export default recycleV2Roles;
