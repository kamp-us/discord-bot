import { Events, Message, TextChannel  } from "discord.js";
import { client } from "../../createDiscordClient";
import { VADIDEKI_GEYIK_CHANNEL_ID, VADIDEKI_LINK_CHANNEL_ID } from "../../config";


const geyikLinkCopyHandler = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.channel.id === VADIDEKI_GEYIK_CHANNEL_ID) {
      const linkRegex = /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\- ?=%.]+/g;
      const links = message.content.match(linkRegex);

      if (links) {
        const belirlenenKanal = client.channels.cache.get(VADIDEKI_LINK_CHANNEL_ID) as TextChannel;

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