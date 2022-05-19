import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import { CLIENT_ID, DISCORD_TOKEN, GUILD_ID } from "./config.js";
import { readdirSync } from "fs";

const commands = [];
const commandFiles = readdirSync("./commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(DISCORD_TOKEN);

rest
  .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => {
    console.log("Commands updated!");
  })
  .catch((error) => {
    console.error(error);
  });
