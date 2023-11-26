import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { KAMPUS_GUILD_ID } from "./config";

const commands: any[] = [];
const commandFiles = readdirSync("./src/commands").filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = await import(`./src/commands/${file}`);
  console.log(file, "file");
  commands.push(command.default.data.toJSON());
  console.log(commands);
}

if (process.env.DISCORD_TOKEN === undefined) {
  throw new Error("DISCORD_TOKEN is undefined");
}
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async (env) => {
  if (process.env.CLIENT_ID === undefined) {
    throw new Error("DISCORD_TOKEN is undefined");
  }
  try {
    console.log("Started refreshing application (/) commands.");
    if (env === "production") {
      console.log("Started refreshing guild (/) commands.");
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, KAMPUS_GUILD_ID), {
        body: commands,
      });
    }
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
