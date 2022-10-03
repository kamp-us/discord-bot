import { SlashCommandBuilder } from "@discordjs/builders";
import { cognitoForgotPassword } from "../../../cognitoForgotPassword.js";
import { sendWithDefer } from "../../../sendWithDefer.js";

const sendResetPasswordCode = {
  data: new SlashCommandBuilder()
    .setName("sifremi-unuttum")
    .setDescription("pano.kamp.us hesabının şifresini sıfırlamak için gereken kodu gönderir.")
    .addStringOption((option) =>
      option.setName("kullanici-adi").setDescription("Kullanıcı adı").setRequired(true)
    ),
  async execute(interaction) {
    const username = interaction.options.getString("kullanici-adi");

    cognitoForgotPassword(username, async ({ message }) => {
      await sendWithDefer(
        interaction,
        2000,
        `Email adresine sifre sifirlama kodu gonderildi. Bu kodu /sifre-degistir <kullanici-adi> <sifirlama-kodu> <yeni-sifre> komutuyla calistiriniz.`
      );
    });
  },
};

export default sendResetPasswordCode;
