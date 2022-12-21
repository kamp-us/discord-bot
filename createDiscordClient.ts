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

  client.commands = new Collection();

  console.log("INITIALIZING COMMANDS");

  const commandFiles = readdirSync("./src/commands").filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const command = await import(`./src/commands/${file}`);

    if (command.default.data) {
      client.commands.set(command.default.data.name, command);
      console.log("[SUCCESS]", file, "command file loaded.");
    } else {
      console.log("[ERROR]", file, "command file is not loaded.");
      continue;
    }
  }

  console.log("COMMANDS ARE READY!");

  // ----------------------------------------------------------------

  console.log("INITIALIZING EVENTS");

  const eventFiles = readdirSync("./src/events/").filter((file) => file.endsWith(".ts"));

  for (const file of eventFiles) {
    const event = await import(`./src/events/${file}`);

    if (event.default) {
      const eventName = event.default.name;

      if (event.once) {
        client.once(eventName, (...args) => event.default.execute(...args));
      } else {
        client.on(eventName, (...args) => event.default.execute(...args, client));
      }

      console.log("[SUCCESS]", file, "event file loaded.");
    } else {
      console.log("[ERROR]", file, "event file is not loaded.");
      continue;
    }
  }

  console.log("EVENTS ARE READY!");

  return client;
};
