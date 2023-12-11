import { Events, Message } from "discord.js";
import { assignRole } from "../commands/assign-role";

const messageCreateInGunaydinChannel = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    const client = message.client;
    const guildID = message.guild?.id;
    if (!guildID) {
      console.error("Guild ID is null.");
      return;
    }

    if (message.channel.id === process.env.GUNAYDIN_CHANNEL_ID) {
      const userRoles = message.member?.roles.cache.map((role) => role.name);

      // if user has v2 role, do nothing
      if (userRoles?.includes("v2")) {
        return;
      }

      assignRole(client, guildID, message.author.id);
    }
  },
};

export default messageCreateInGunaydinChannel;
