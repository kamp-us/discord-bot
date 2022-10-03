import { SlashCommandBuilder } from "@discordjs/builders";
import { cognitoConfirmUser } from "../../../cognitoConfirmUser.js";
import { sendWithDefer } from "../../../sendWithDefer.js";

const confirmActivation = {
  data: new SlashCommandBuilder()
    .setName("uyelik-onayla")
    .setDescription("Uyelik onayla")
    .addStringOption((option) =>
      option.setName("kullanici-adi").setRequired(true).setDescription("Kullanıcı adınızı yazın")
    )
    .addStringOption((option) =>
      option.setName("aktivasyon-kodu").setRequired(true).setDescription("Aktivasyon kodunu girin")
    ),
  async execute(interaction) {
    const username = interaction.options.getString("kullanici-adi");
    const code = interaction.options.getString("aktivasyon-kodu");

    cognitoConfirmUser(username, code, async ({ message }) => {
      await sendWithDefer(interaction, 2000, message);
    });
  },
};

export default confirmActivation;
