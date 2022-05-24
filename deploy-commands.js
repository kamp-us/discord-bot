import { REST } from "@discordjs/rest";
import { CLIENT_ID, DISCORD_TOKEN, GUILD_ID } from "./config.js";
import { readdirSync } from "fs";
import { Routes } from "discord-api-types/v9";

const commands = [];
const commandFiles = readdirSync("./commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

console.log(commands, "COMMANDS");

const rest = new REST({ version: "9" }).setToken(DISCORD_TOKEN);

(async (env) => {
  try {
    console.log("Started refreshing application (/) commands.");
    if (env === "production") {
      console.log("Started refreshing guild (/) commands.");
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    }
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
