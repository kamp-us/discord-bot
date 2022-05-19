import { SlashCommandBuilder } from "@discordjs/builders";
import { cognitoResendActivation } from "../cognitoResendActivation.js";

const resendActivation = {
  data: new SlashCommandBuilder()
    .setName("uyelik-aktivasyon-kodu-yenile")
    .setDescription("Uyelik aktivasyon kodunu tekrar gonderir.")
    .addStringOption((option) =>
      option.setName("kullanici-adi").setRequired(true).setDescription("Kullanici adi")
    ),
  async execute(interaction) {
    const username = interaction.options.getString("kullanici-adi");

    cognitoResendActivation(username, async ({ message }) => {
      await interaction.user.send(message);
    });
  },
};

export default resendActivation;
