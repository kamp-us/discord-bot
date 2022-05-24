import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

const goLive = {
  data: new SlashCommandBuilder()
    .setName("yayindayim")
    .setDescription("Yayinda oldugunu belli etmek icin kullanilir")
    .addStringOption((option) =>
      option.setName("yayin-basligi").setDescription("Yayin basligini belirtin").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("yayin-linki").setDescription("Yayin linkini belirtin").setRequired(true)
    ),
  async execute(interaction, discordClient) {
    const streamTitle = interaction.options.getString("yayin-basligi");
    const streamLink = interaction.options.getString("yayin-linki");
    const channel = discordClient.channels.cache.get("672571847467860027");
    const user = interaction.user;

    const exampleEmbed = new MessageEmbed()
      .setColor("#ff8a00")
      .setTitle(streamTitle)
      .setURL(streamLink)
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL(),
      })
      .setDescription("Yayindayim arkadaslarim")
      .setImage("https://bit.ly/3k5XcAT")
      .setTimestamp();

    channel.send({ embeds: [exampleEmbed] });
  },
};

export default goLive;
