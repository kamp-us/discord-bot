import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { CLIENT_ID, DISCORD_TOKEN, KAMPUS_GUILD_ID } from "./config";

const commands: any[] = [];
const commandFiles = readdirSync("./src/commands").filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = await import(`./src/commands/${file}`);
  console.log(file, "file");
  commands.push(command.default.data.toJSON());
  console.log(commands);
}

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

(async (env) => {
  try {
    console.log("Started refreshing application (/) commands.");
    if (env === "production") {
      console.log("Started refreshing guild (/) commands.");
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, KAMPUS_GUILD_ID), {
        body: commands,
      });
    }
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
