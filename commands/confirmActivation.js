import { SlashCommandBuilder } from "@discordjs/builders";
import { cognitoConfirmUser } from "../cognitoConfirmUser.js";

const confirmActivation = {
  data: new SlashCommandBuilder()
    .setName("uyelik-onayla")
    .setDescription("Uyelik onayla")
    .addStringOption((option) =>
      option.setName("kullanici-adi").setRequired(true).setDescription("Kullanici adinizi giriniz.")
    )
    .addStringOption((option) =>
      option
        .setName("aktivasyon-kodu")
        .setRequired(true)
        .setDescription("Aktivasyon kodunu giriniz.")
    ),
  async execute(interaction) {
    const code = interaction.options.getString("aktivasyon-kodu");
    const username = interaction.options.getString("kullanici-adi");

    cognitoConfirmUser(username, code, async ({ message }) => {
      await interaction.user.send(message);
    });
  },
};

export default confirmActivation;
