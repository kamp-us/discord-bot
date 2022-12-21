import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";

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
