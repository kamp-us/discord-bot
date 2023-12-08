import { readdirSync, realpathSync } from "fs";
import { join } from "path";
import { DiscordClient } from "../../createDiscordClient";

const dirname = realpathSync(".");
export default async (client: DiscordClient) => {
  console.log("INITIALIZING COMMAND HANDLER");

  const commandsPath = join(dirname, "/src/commands");
  console.log(commandsPath);
  const commandFiles = readdirSync(commandsPath).filter((file: any) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = await import(filePath);

    if (command.default.data) {
      client.commands.set(command.default.data.name, command.default);
      console.log("[✅ SUCCESS]", file, "command file loaded.");
    } else {
      console.log("[❌ ERROR]", file, "command file is not loaded.");
    }
  }

  console.log("COMMANDS ARE READY!\n");
};
