import { CommandInteraction, Constants, SlashCommandBuilder, TextChannel } from "discord.js";
import { GUNAYDIN_CHANNEL_ID } from "../../config";

const allowedUsers = ["256111023939911683", "297782785396178946"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gunun-sorusu")
    .setDescription("Günün sorusunu oluşturur."),
  async execute(interaction: CommandInteraction) {
    const channel = (await interaction.client.channels.fetch("839426893547044890")) as TextChannel;

    const today = new Date();
    const options = {
      month: "long",
      day: "numeric",
    } as Intl.DateTimeFormatOptions;
    const formattedDate = new Intl.DateTimeFormat("tr-TR", options).format(today);

    const thread = await channel.threads.create({
      name: "Günün Sorusu - " + formattedDate,
    });

    const geyik = `<:geyik:1161771822350602260>`;
    const threadMention = `<#${thread.id}>`;
    const message = await channel.send(threadMention);
    const threadMessage = await thread.send(
      `Volkan abi ve geyikler günün sorusunu soruyor!\n ${geyik} ${geyik} ${geyik} ${geyik} ${geyik} ${geyik}`
    );
    const messagePin = await message.pin();
    Promise.all([threadMessage, messagePin, message]);

    interaction.reply({
      content: `Günün sorusu başarıyla oluşturuldu! Thread icin: ${threadMention}`,
      ephemeral: true,
    });
  },
};
