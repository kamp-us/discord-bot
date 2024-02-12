import { Events, Message, TextChannel  } from "discord.js";
import { client } from "../../createDiscordClient";



const geyikLinkCopyHandler = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.channel.id === process.env.VADIDEKI_GEYIK_CHANNEL_ID) {
      const linkRegex = /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\- ?=%.]+/g;
      const links = message.content.match(linkRegex);

      if (links) {
        const belirlenenKanal = client.channels.cache.get(process.env.VADIDEKI_LINK_CHANNEL_ID ?? "") as TextChannel;

        if (belirlenenKanal) {
          links.forEach((link) => {
            belirlenenKanal.send(`Geyik Chatteki Link: ${link}`);
          });
        } else {
          console.error("Belirlenen kanal bulunamadı.");
        }
      }
    }
  },
};


export default geyikLinkCopyHandler;