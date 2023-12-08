import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { readdirSync, realpathSync } from "fs";
import { join } from "path";

export interface DiscordClient extends Client {
  commands: Collection<string, any>;
}

const createDiscordClient = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildModeration,
    ],
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.Reaction,
      Partials.User,
      Partials.GuildMember,
    ],
  }) as DiscordClient;

  client.commands = new Collection();

  const dirname = realpathSync(".");
  // When the client is ready, run this code (only once)
  client.once("ready", async () => {
    console.log("Ready!");

    console.log("REGISTERING HANDLERS");
    const handlerFolderPath = join(dirname, "src/handlers");
    const handlerFiles = readdirSync(handlerFolderPath).filter((file) => {
      return file.endsWith(".handler.ts");
    });
    console.log(handlerFiles);
    for (const file of handlerFiles) {
      console.log("REGISTERING HANDLE: ", file);
      const filePath = join(handlerFolderPath, file);
      const handler = await import(filePath);
      handler.default(client);
    }
  });

  return client;
};

export const client = await createDiscordClient();
