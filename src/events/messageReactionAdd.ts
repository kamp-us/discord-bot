import { GUILD_ID, ROLE_NAME } from "../../config";
import {
  fetchPartialMessage,
  checkChannelIdsAndReactionName,
  isReactionMessage,
  addRole,
  selectByNameCallback,
} from "../utils";

const messageReactionAdd = {
  name: "messageReactionAdd",
  async execute(reaction, user, client) {
    // Fetch the message if it is partial.
    fetchPartialMessage(reaction);

    // Check if the reaction is given to the rules message.
    if (!isReactionMessage(reaction)) return;

    // Get the guild from the guildId of the reacted message.
    const guild = client.guilds.cache.get(GUILD_ID);

    // Check if the channel id of the reacted message is the same as the channel id of the Rules channel and the name of the reaction emoji is the same.
    const checkChannelsAndEmoji = checkChannelIdsAndReactionName(guild.rulesChannelId, reaction);

    // Check if the guild does not exist or checkChannelsAndEmoji is false. If so, it will return.
    if (guild && checkChannelsAndEmoji) {
      addRole(guild, user, selectByNameCallback(ROLE_NAME));
    }
  },
};

export default messageReactionAdd;
