import { Permissions } from "discord.js";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { BOT_LOG_CHANNEL_NAME, EMOJI_NAME, RULES_MESSAGE_ID } from "../config";

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
export function checkChannelIdsAndReactionName(rulesChannelId, reaction) {
  // Get the message channelId and emoji name from the reaction.
  const msgChannelId = reaction.message.channelId;
  const reactionEmojiName = reaction.emoji.name;

  return rulesChannelId === msgChannelId && reactionEmojiName === EMOJI_NAME;
}

/**
 * Fetch the message if it is partial.
 * @param obj - object.
 */
export async function fetchPartialMessage(obj) {
  if (obj.message.partial) await obj.message.fetch();
}

/**
 * Check if the reaction is given to the rules message.
 * @param reaction - Reaction object
 * @returns boolean
 */
export function isReactionMessage(reaction) {
  return reaction.message.id === RULES_MESSAGE_ID;
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
 * Callback function for checking names
 * @param name
 * @returns cb function
 */
export function selectByNameCallback(name) {
  return (obj) => obj.name === name;
}

/**
 * Add role to member.
 * @param guild object
 * @param user object
 * @param cb callback
 */
export async function addRole(guild, user, cb) {
  // Find the role with the name roleName.
  const role = guild.roles.cache.find(cb);

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

  // Check if the role was added to the member. If it was, it will log a message to the console.
  // If it was not, it will send a message to the bot log channel.
  try {
    // Add role to member.
    const m = await member?.roles.add(role);
    console.log(`ADD "${role.name}" ROLE TO "${m.user.username}"`);
  } catch (e) {
    sendLog(
      guild,
      `An error occurred while trying to add the "${role.name}" role to member "${member.user.tag}". Check console log.`
    );

    // Log the error to the console.
    console.log("ADD ROLE ERROR", e);
  }
}

/**
 * Remove role from member.
 * @param guild object
 * @param user object
 * @param cb callback
 */
export async function removeRole(guild, user, cb) {
  // Find the role with the name roleName.
  const role = guild.roles.cache.find(cb);

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

  // Check if the role has been removed from the member. If so, it will log a message to the console.
  // If not, the bot will send a message to the log channel.
  try {
    // Remove the role from member.
    const m = await member?.roles.remove(role);
    console.log(`REMOVE "${role.name}" ROLE FROM "${m.user.username}"`);
  } catch (e) {
    sendLog(
      guild,

      `An error occurred while trying to remove the "${role.name}" role from "${member.user.tag}". Check console log.`
    );

    // Log the error to the console.
    console.log("REMOVE ROLE ERROR", e);
  }
}
