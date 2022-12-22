import { Permissions } from "discord.js";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { BOT_LOG_CHANNEL_NAME } from "../config";

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}
export function validateUsername(username: unknown): username is string {
  return typeof username === "string" && username.length >= 2;
}
export function validatePassword(password: unknown): password is string {
  return typeof password === "string" && password.length > 8;
}
export function generatePassword() {
  return uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
}

/**
 * Return true if the channel ID of the reacted message is the same as the channel ID of the channel and the reaction
 * emoji name is the same as emojiName.
 * @param channel - The channel you want to check the reaction in.
 * @param reaction - The reaction object.
 * @param emojiName - The name of the emoji you want to check for.
 * @returns a boolean value.
 */
export function checkChannelIdsAndReactionName(channel, reaction, emojiName) {
  // Get the message channelId and emoji name from the reaction.
  const msgChannelId = reaction.message.channelId;
  const reactionEmojiName = reaction.emoji.name;

  return channel?.id === msgChannelId && reactionEmojiName === emojiName;
}

/**
 * Check if the bot has the permission.
 * @param guild
 * @param permission
 * @returns a boolean value.
 */
export function checkBotPermission(guild, permission) {
  return guild.me?.permissions.has(permission);
}

/**
 * Sends log message to a channel.
 * @param guild object
 * @param message string
 */
export function sendLog(guild, message) {
  // Find the bot log channel with the name BOT_LOG_CHANNEL_NAME.
  const botLogChannel = guild?.channels.cache.find((ch) => ch.name === BOT_LOG_CHANNEL_NAME);

  // Resolve the botLogChannel to be able to send messages.
  const resolvedBotLogCh = guild?.channels.resolve(botLogChannel);

  // Check if the bot log channel exists. If it does not exist, it will not send a message to
  // the bot log channel.
  if (botLogChannel) {
    resolvedBotLogCh.send(message);
  }
}

/**
 * Add role to member.
 * @param guild object
 * @param user object
 * @param roleName string
 */
export function addRole(guild, user, roleName) {
  // Find the role with the name roleName.
  const role = guild.roles.cache.find((r) => r.name === roleName);

  // Checking if the role exists. If it does not exist, it will send a message to the bot log channel.
  if (!role) {
    sendLog(guild, "Role not found");
    return;
  }

  // Check if the bot has the Manage Roles permission. If not, it will send a message to the bot log channel.
  if (!checkBotPermission(guild, Permissions.FLAGS.MANAGE_ROLES)) {
    sendLog(guild, "Bot cannot manage roles.");
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
      sendLog(
        guild,

        `An error occurred while trying to add the "${role.name}" role to member "${member.user.tag}". Check console log.`
      );

      // Log the error to the console.
      console.log("ADD ROLE ERROR", e);
    });
}

/**
 * Remove role from member.
 * @param guild object
 * @param user object
 * @param roleName string
 */
export function removeRole(guild, user, roleName) {
  // Find the role with the name roleName.
  const role = guild.roles.cache.find((r) => r.name === roleName);

  // Checking if the role exists. If it does not exist, it will send a message to the bot log channel.
  if (!role) {
    sendLog(guild, "Role not found");
    return;
  }

  // Check if the bot has the Manage Roles permission. If not, it will send a message to the bot log channel.
  if (!checkBotPermission(guild, Permissions.FLAGS.MANAGE_ROLES)) {
    sendLog(guild, "Bot cannot manage roles.");
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
      sendLog(
        guild,

        `An error occurred while trying to remove the "${role.name}" role from "${member.user.tag}". Check console log.`
      );

      // Log the error to the console.
      console.log("REMOVE ROLE ERROR", e);
    });
}
