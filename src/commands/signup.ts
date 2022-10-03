import { bold, SlashCommandBuilder, spoiler } from "@discordjs/builders";
import { signUp } from "../handlers/sign-up";
import { sendWithDefer } from "../../sendWithDefer";

const usernameOption = "kullanici-adi";
const emailOption = "e-posta";

const signup = {
  data: new SlashCommandBuilder()
    .setName("uye-ol")
    .setDescription("pano.kamp.us'a üye olmak için kullanılır")
    .addStringOption((option) =>
      option
        .setName(usernameOption)
        .setDescription("pano.kamp.us'e kayıt olmak için kullanıcı adı")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("e-posta")
        .setDescription("pano.kamp.us'e kayıt olmak için email adresi")
        .setRequired(true)
    ),
  async execute(interaction: any) {
    const email = interaction.options.getString(emailOption);
    const username = interaction.options.getString(usernameOption);
    const loginUrl = "https://pano.kamp.us/login";

    const { data, errors } = await signUp(username, email);

    if (errors) {
      await sendWithDefer(interaction, 4000, errors);
    } else {
      await sendWithDefer(
        interaction,
        2000,
        `${username} ismiyle kayıt oldun` +
          `\nHesabının şifresi -> ${spoiler(data.password)} <- olarak ayarlandı` +
          `\n-----------------------------------------------------------` +
          `\n/yardim komutunu çalıstırarak bütün komutları görebilirsin` +
          `\nhttps://pano.kamp.us/login adresinden giriş yaptıktan sonra şifreni değiştirmeni öneririz` +
          `\n:tada::tada:  ${bold(loginUrl)}  :tada::tada:`
      );
    }
  },
};

export default signup;
