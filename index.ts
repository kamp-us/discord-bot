import { DISCORD_TOKEN } from "./config";
import { client } from "./createDiscordClient";

// Login to Discord with your client's token
client.login(DISCORD_TOKEN).then(() => {
  console.log("Logged in!");
});
