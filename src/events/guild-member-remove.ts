import { Events, GuildMember, TextChannel, bold } from "discord.js";
import { GIDENLER_CHANNEL_ID } from "../../config";

const guildMemberRemove = {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember) {
    const client = member.client;
    const guild = member.guild;

    const gidenlerChannel = (await client.channels.fetch(GIDENLER_CHANNEL_ID)) as TextChannel; // Replace with your channel ID
    if (!gidenlerChannel) return;

    console.log(`${member.user.tag} aramızdan ayrıldı :(`);
    gidenlerChannel.send(
      `${bold(member.user.tag)} aramızdan ayrıldı :(\nToplam üye sayısı: ${guild.memberCount}
      ${
        process.env.GIDENLER_VIDEO_LINK
          ? `\nOna burdan bu videoyu gönderelim\n ${process.env.GIDENLER_VIDEO_LINK}}`
          : ""
      }
      `
    );
  },
};

export default guildMemberRemove;
