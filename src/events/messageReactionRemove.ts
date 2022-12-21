import { Permissions } from "discord.js";
import {
  BOT_LOG_CHANNEL_NAME,
  EMOJI_NAME,
  ROLE_NAME,
  RULES_CHANNEL_NAME,
  RULES_MESSAGE_ID,
} from "../../config";
import { checkChannelIdsAndReactionName } from "../utils";

const messageReactionRemove = {
  name: "messageReactionRemove",
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

    // Find the bot log channel with the name BOT_LOG_CHANNEL_NAME.
    const botLogChannel = guild?.channels.cache.find((ch) => ch.name === BOT_LOG_CHANNEL_NAME);

    // Resolve the botLogChannel to be able to send messages.
    const resolvedBotLogCh = reaction.client.channels.resolve(botLogChannel);

    // Check if the guild does not exist or checkChannelsAndEmoji is false. If so, it will return.
    if (!guild || !checkChannelsAndEmoji) return;

    // Find the role with the name ROLE_NAME.
    const role = guild.roles.cache.find((r) => r.name === ROLE_NAME);

    // Checking if the role exists. If it does not exist, it will send a message to the bot log channel.
    if (!role) {
      // Check if the bot log channel exists. If it does not exist, it will not send a message to
      // the bot log channel.
      if (botLogChannel) {
        resolvedBotLogCh.send("Role not found.");
      }
      return;
    }

    // Check if the bot has the permission to manage roles.
    const botCanManageRoles = guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES);

    // Check if the Manage Roles permission exists. If it does not exist, it will send a message to the bot log channel.
    if (!botCanManageRoles) {
      // Check if the bot log channel exists. If it does not exist, it will not send a message to
      // the bot log channel.
      if (botLogChannel) {
        resolvedBotLogCh.send("Bot cannot manage roles.");
      }
      return;
    }

    // Get the member who reacted to the message.
    const member = guild.members.cache.get(user.id);

    // Remove the role from member.
    const roleRemove = member?.roles.remove(role);

    // Check if the role has been removed from the member. If so, it will log a message to the console.
    // If not, the bot will send a message to the log channel.
    roleRemove
      ?.then((m) => console.log(`REMOVE "${role.name}" ROLE FROM "${m.user.username}"`))
      .catch((e) => {
        // Check if the bot log channel exists. If it does not exist, it will not send a message to
        // the bot log channel.
        if (botLogChannel) {
          resolvedBotLogCh.send(
            `An error occurred while trying to remove the "${role.name}" role from "${user.tag}". Check console log.`
          );
        }

        // Log the error to the console.
        console.log("REMOVE ROLE ERROR", e);
      });
  },
};

export default messageReactionRemove;
