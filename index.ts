import { client } from "./createDiscordClient";
import dotenv from "dotenv";

dotenv.config();

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log("Logged in!");
});
