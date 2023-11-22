import { DiscordClient } from "../../createDiscordClient";
import path from "path";
import { fileURLToPath } from "url";
import { NEXTAUTH_URL } from "../../config";

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

export const getSession = async () => {
  // const headers = new Headers(request.headers);
  try {
    // const cookie = headers.get("cookie");
    const session = await fetch(`${NEXTAUTH_URL}/session`, {
      method: "GET",
      headers: {
        // cookie: cookie || "",
        cookie: "",
      },
    }).then((res) => res.json());

    return session;
  } catch (e) {
    // handle error for session request fails
    return null;
  }
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
