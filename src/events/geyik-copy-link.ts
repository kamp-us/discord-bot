import { Client, GatewayIntentBits, Partials, TextChannel } from "discord.js";
import { VADIDEKI_GEYIK_CHANNEL_ID, VADIDEKI_LINK_CHANNEL_ID } from "../../config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.User],
});


let dailyThread;


client.on("messageCreate", async (message) => {
  if (message.channelId === VADIDEKI_GEYIK_CHANNEL_ID) {
    if (message.content.includes("http") || message.content.includes("www")) {
      const belirlenenKanal = client.channels.cache.get(VADIDEKI_LINK_CHANNEL_ID) as TextChannel;

      if (belirlenenKanal) {
        
        if (!dailyThread) {
          const today = new Date();
          const options = {
            month: "long",
            day: "numeric",
          } as Intl.DateTimeFormatOptions;
          const formattedDate = new Intl.DateTimeFormat("tr-TR", options).format(today);

          dailyThread = await belirlenenKanal.threads.create({
            name: `Links for ${formattedDate}`,
            autoArchiveDuration: 1440, 
          });
        }

        dailyThread.send(`${message.author.tag} Geyik Kanalındaki Link: ${message.content}`);
      }
    }
  }
});