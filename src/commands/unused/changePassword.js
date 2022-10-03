import { SlashCommandBuilder } from "@discordjs/builders";
import { cognitoChangePassword } from "../../../cognitoChangePassword.js";
import { sendWithDefer } from "../../../sendWithDefer.js";
import Debug from "debug";

const debug = Debug("kampus-bot:commands:changePassword");

const changePassword = {
  data: new SlashCommandBuilder()
    .setName("sifre-degistir")
    .setDescription("Kullanicinin sifresini degistirir.")
    .addStringOption((option) =>
      option.setName("kullanici-adi").setDescription("Kullanıcı adı").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("sifirlama-kodu").setDescription("Sıfırlama kodu").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("yeni-sifre").setRequired(true).setDescription("Yeni şifre")
    ),
  async execute(interaction) {
    const username = interaction.options.getString("kullanici-adi");
    const code = interaction.options.getString("sifirlama-kodu");
    const password = interaction.options.getString("yeni-sifre");

    cognitoChangePassword(username, code, password, async ({ message }) => {
      await sendWithDefer(interaction, 2000, message);
    });
  },
};
debug("registered");

export default changePassword;
