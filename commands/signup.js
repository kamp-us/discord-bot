import { SlashCommandBuilder } from "@discordjs/builders";
import { cognitoSignUp } from "../cognitoSignUp.js";

const signup = {
  data: new SlashCommandBuilder()
    .setName("uye-ol")
    .setDescription("pano.kamp.us'a uye olmak icin kullanilir")
    .addStringOption((option) =>
      option
        .setName("kullanici-adi")
        .setDescription("pano.kamp.us'e kayit olmak icin kullanici adi")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("e-posta")
        .setDescription("sunucuya kayit olmak icin email adresi")
        .setRequired(true)
    ),
  async execute(interaction) {
    const email = interaction.options.getString("e-posta");
    const username = interaction.options.getString("kullanici-adi");
    const loginUrl = "https://pano.kamp.us/login";

    cognitoSignUp(username, email, ({ username, password, error }) => {
      if (error) {
        interaction.reply(error);
        return;
      }
      interaction.reply("Hosgeldin, detaylari DM olarak gonderdim");
      interaction.user.send(
        `->${username}<- kullanici adiyla kayit olunuyor...\nSifreniz: ${password}\nLutfen bu bilgileri kullanarak ${loginUrl} sayfasindan giris yapiniz.`
      );
    });
  },
};

export default signup;
