import { bold, SlashCommandBuilder, spoiler } from "@discordjs/builders";

const info = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get info about a user or a server!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Info about a user")
        .addUserOption((option) => option.setName("target").setDescription("The user"))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("server").setDescription("Info about the server")
    )
    .addSubcommand((subcommand) => subcommand.setName("deneme").setDescription("deneme")),
  async execute(interaction) {
    const subCommand = interaction.options.getSubcommand();
    const a = interaction.isMessageComponent();
    console.log(a, "AAAAAAAAAAAAAAAAA");
    console.log(interaction, "INTERACTION");

    switch (subCommand) {
      case "user":
        const user = interaction.options.getUser("target");
        if (user) {
          await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
        } else {
          await interaction.reply(
            `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`
          );
        }
        break;

      case "server":
        await interaction.reply(
          `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
        );
        break;

      case "deneme":
        await interaction.reply(
          `
        -> ${bold(
          "elwyron"
        )} <- ismiyle kayit oldunuz. Kayit oldugunuz maile aktivasyon kodu gonderilmistir.\n
        ${bold(
          "/uyelik-onayla <aktivasyon-kodu>"
        )} komutunu calistirarak uyeliginizi onaylayabilirsiniz.\n
        Hesabinizin sifresi -> ${spoiler(
          "sifre"
        )} <- olarak ayarlanmistir. Bu sifreyini kullanarak https://pano.kamp.us/login adresinden giris yaptiktan sonra sifrenizi degistirmenizi oneririz.\n
        kamp.us'e hosgeldiniz!`
        );
    }
  },
};

export default info;
