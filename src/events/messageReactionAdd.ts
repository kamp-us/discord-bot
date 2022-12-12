import { Permissions } from "discord.js";
import {
  BOT_LOG_CHANNEL_NAME,
  EMOJI_NAME,
  ROLE_NAME,
  RULES_CHANNEL_NAME,
  RULES_MESSAGE_ID,
} from "../../config";
import { client } from "../../createDiscordClient";

const messageReactionAdd = {
  name: "messageReactionAdd",
  async execute(reaction, user) {
    // Fetch the message content.
    if (reaction.message.partial) await reaction.message.fetch();

    // Check if the message content starts with the string in the RULES_MESSAGE_ID variable.
    // If it does not, it will return.
    if (reaction.message.id !== RULES_MESSAGE_ID) return;

    // Get the guildId, channelId and emoji name from the reaction.
    const msgGuildId = reaction.message.guildId;
    const msgChannelId = reaction.message.channelId;
    const emojiName = reaction.emoji.name;

    // Get the guild from the guildId of the reacted message.
    const guild = client.guilds.cache.get(msgGuildId);

    // Find the rules channel with the name RULES_CHANNEL_NAME.
    const rulesChannel = guild?.channels.cache.find((ch) => ch.name === RULES_CHANNEL_NAME);

    // Find the bot log channel with the name BOT_LOG_CHANNEL_NAME.
    const botLogChannel = guild?.channels.cache.find((ch) => ch.name === BOT_LOG_CHANNEL_NAME);

    // Resolve the botLogChannel to be able to send messages.
    const resolvedBotLogCh = reaction.client.channels.resolve(botLogChannel);

    // Check if the guild exists, rulesChannel exists and if the ID of the rulesChannel is the same as the channel ID of the reacted message,
    // emojiName is the same as EMOJI_NAME in the config. If any of these are not true, it will return.
    if (!guild || rulesChannel?.id !== msgChannelId || emojiName !== EMOJI_NAME) return;

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

    // Add role to member.
    const roleAdd = member?.roles.add(role);

    // Check if the role was added to the member. If it was, it will log a message to the console.
    // If it was not, it will send a message to the bot log channel.
    roleAdd
      ?.then((m) => console.log(`ADD "${role.name}" ROLE FROM "${m.user.username}"`))
      .catch((e) => {
        // Check if the bot log channel exists. If it does not exist, it will not send a message to
        // the bot log channel.
        if (botLogChannel) {
          resolvedBotLogCh.send(
            `An error occurred while trying to add the "${role.name}" role to member "${user.tag}". Check console log.`
          );
        }

        // Log the error to the console.
        console.log("ADD ROLE ERROR", e);
      });
  },
};

export default messageReactionAdd;
