import { DiscordClient } from "../../createDiscordClient";
import path from "path";
import { fileURLToPath } from "url";
import { writeFile } from "fs";

export const isUserInThisGuild = async (client: DiscordClient, userID: string, guildID: string) => {
  const guild = await client.guilds.fetch(guildID);

  try {
    await guild.members.fetch(userID);
    return true;
  } catch (error) {
    return false;
  }
};

export const getDirName = function (moduleUrl) {
  const filename = fileURLToPath(moduleUrl);
  return path.dirname(filename);
};

export function formatDate(date: Date | number | string) {
  if (!(date instanceof Date)) date = new Date(date);
  const days = date.getDate().toString().padStart(2, "0"); // Add leading zero if needed
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${days} ${monthName} ${year}, ${hours}:${minutes}:${seconds}`;
}

export async function writeToFile(messages: any, fileName: string) {
  let result: (NodeJS.ErrnoException | null)[] | (string | null)[] = [];
  writeFile(fileName, JSON.stringify(messages, null, 2), (err) => {
    if (err) {
      result = [null, err];
    } else {
      result = [fileName, null];
    }
  });
  return result;
}
