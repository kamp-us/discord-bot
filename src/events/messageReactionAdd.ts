import {
  BOT_LOG_CHANNEL_NAME,
  EMOJI_NAME,
  ROLE_NAME,
  RULES_CHANNEL_NAME,
  RULES_MESSAGE_ID,
} from "../../config";
import { checkChannelIdsAndReactionName, addRole } from "../utils";

const messageReactionAdd = {
  name: "messageReactionAdd",
  async execute(reaction, user, client) {
    // Fetch the message content.
    if (reaction.message.partial) await reaction.message.fetch();

    // Check if the message content starts with the string in the RULES_MESSAGE_ID variable.
    // If it does not, it will return.
    if (reaction.message.id !== RULES_MESSAGE_ID) return;

    // Get the guildId.
    const msgGuildId = reaction.message.guildId;

    // Get the guild from the guildId of the reacted message.
    const guild = client.guilds.cache.get(msgGuildId);

    // Find the rules channel with the name RULES_CHANNEL_NAME.
    const rulesChannel = guild?.channels.cache.find((ch) => ch.name === RULES_CHANNEL_NAME);

    // Check if the channel id of the reacted message is the same as the channel id of the RulesChannel and the name of the reaction emoji is the same as EMOJI_NAME.
    const checkChannelsAndEmoji = checkChannelIdsAndReactionName(
      rulesChannel,
      reaction,
      EMOJI_NAME
    );

    // Check if the guild does not exist or checkChannelsAndEmoji is false. If so, it will return.
    if (guild && checkChannelsAndEmoji) {
      addRole(guild, user, ROLE_NAME);
    }
  },
};

export default messageReactionAdd;
