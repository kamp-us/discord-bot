import { bold, SlashCommandBuilder, spoiler } from "@discordjs/builders";
import { cognitoSignUp } from "../cognitoSignUp.js";
import { sendWithDefer } from "../sendWithDefer.js";

const signup = {
  data: new SlashCommandBuilder()
    .setName("uye-ol")
    .setDescription("pano.kamp.us'a üye olmak için kullanılır")
    .addStringOption((option) =>
      option
        .setName("kullanici-adi")
        .setDescription("pano.kamp.us'e kayıt olmak için kullanıcı adı")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("e-posta")
        .setDescription("pano.kamp.us'e kayıt olmak için email adresi")
        .setRequired(true)
    ),
  async execute(interaction) {
    const email = interaction.options.getString("e-posta");
    const username = interaction.options.getString("kullanici-adi");
    const loginUrl = "https://pano.kamp.us/login";

    cognitoSignUp(username, email, async ({ username, password, error }) => {
      if (error) {
        await sendWithDefer(interaction, 2000, error);
        return;
      }
      await sendWithDefer(
        interaction,
        2000,
        `${username} ismiyle kayıt oldun` +
          `\nHesabının şifresi -> ${spoiler(password)} <- olarak ayarlandı` +
          `\nEmail adresine aktivasyon kodu gönderildi` +
          `\n-----------------------------------------------------------` +
          `\n/uyelik-onayla <aktivasyon-kodu> komutunu çalıstırarak üyeliğini onaylayabilirsin` +
          `\n/yardim komutunu çalıstırarak bütün komutları görebilirsin` +
          `\nhttps://pano.kamp.us/login adresinden giriş yaptıktan sonra şifreni değiştirmeni öneririz` +
          `\n:tada::tada:  ${bold(loginUrl)}  :tada::tada:`
      );
    });
  },
};

export default signup;
