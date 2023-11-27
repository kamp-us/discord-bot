import { Events, Message } from "discord.js";
import { assignRole } from "../commands/assign-role";
import { GUNAYDIN_CHANNEL_ID } from "../../config";

const messageCreateInGunaydinChannel = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    const client = message.client;
    const guildID = message.guild?.id;
    if (!guildID) {
      console.error("Guild ID is null.");
      return;
    }

    if (message.channel.id === GUNAYDIN_CHANNEL_ID) {
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
