// Create a new client instance
import { Client, Collection, Intents } from "discord.js";
import { readdirSync } from "fs";

// 32767 means every FLAGS in discord.js in bits
const intents = new Intents(32767);

export const createDiscordClient = async () => {
  const client = new Client({
    intents,
    partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
  }) as Client & { commands: Collection<string, any> };

  // When the client is ready, run this code (only once)
  client.once("ready", () => {
    console.log("Ready!");
  });

  client.commands = new Collection();
  const commandFiles = readdirSync("./src/commands").filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const command = await import(`./src/commands/${file}`);
    client.commands.set(command.default.data.name, command);
  }

  return client;
};
