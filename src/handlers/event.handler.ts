import { readdirSync, realpathSync } from "fs";
import { join } from "path";
import { DiscordClient } from "../../createDiscordClient";

const dirname = realpathSync(".");
export default async (client: DiscordClient) => {
  console.log("INITIALIZING EVENT HANDLER");

  const eventsPath = join(dirname, "src/events");
  const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith(".ts"));

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = await import(filePath);

    if (event.default) {
      if (event.default.once) {
        client.once(event.default.name, (...args: any[]) => event.default.execute(...args));
      } else {
        client.on(event.default.name, (...args: any[]) => event.default.execute(...args, client));
      }
      console.log("[✅ SUCCESS]", file, "event file loaded.");
    } else {
      console.log("[❌ ERROR]", file, "event file is not loaded.");
    }
  }

  console.log("EVENTS ARE READY!");
};
