import { SlashCommandBuilder } from "@discordjs/builders";
import { sendWithDefer } from "../sendWithDefer.js";

const help = {
  data: new SlashCommandBuilder().setName("yardim").setDescription("Yardım"),
  async execute(interaction) {
    await sendWithDefer(
      interaction,
      2000,
      "**Komutlar:**\n\n" +
        "/uye-ol <kullanici-adi> <email> - pano.kamp.us'e uye yapar\n" +
        "/uyelik-onayla <kullanici-adi> <sifre> - pano.kamp.us uyeligini onaylar\n" +
        "/uyelik-aktivasyon-kodu-gonder <kullanici-adi> - pano.kamp.us uyeligi icin gereken aktivasyon kodunu yeniden gonderir\n" +
        "/yardim - yardim komutunu gosterir\n"
    );
  },
};

export default help;
