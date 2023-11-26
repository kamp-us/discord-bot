import { client } from "./createDiscordClient";
import dotenv from "dotenv";

dotenv.config();

// Login to Discord with your client's token
console.log("HEREEEEEEEE => ", process.env.DISCORD_TOKEN);
client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log("Logged in!");
});
