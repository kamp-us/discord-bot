import { SlashCommandBuilder } from "@discordjs/builders";
import { cognitoResendActivation } from "../cognitoResendActivation.js";
import { sendWithDefer } from "../sendWithDefer.js";

const resendActivation = {
  data: new SlashCommandBuilder()
    .setName(`uyelik-aktivasyon-kodu-gonder`)
    .setDescription("Uyelik aktivasyon kodunu tekrar gonderir.")
    .addStringOption((option) =>
      option.setName("kullanici-adi").setRequired(true).setDescription("Kullanici adi")
    ),
  async execute(interaction) {
    const username = interaction.options.getString("kullanici-adi");

    cognitoResendActivation(username, async ({ message }) => {
      await sendWithDefer(interaction, 2000, message);
    });
  },
};

export default resendActivation;
