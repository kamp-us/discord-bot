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
        const type = interaction.channel.type;
        if (type === "DM") {
          await interaction.reply("/info server komutu DM'de kullanılamaz.");
        }
        await interaction.reply(
          `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
        );
        break;

      case "deneme":
        await interaction.reply(
          `yo ismiyle kayıt oldun` +
            `\nHesabının şifresi -> ${spoiler("123")} <- olarak ayarlandı` +
            `\nEmail adresine aktivasyon kodu gönderildi` +
            `\n-----------------------------------------------------------` +
            `\nŞimdi /uyelik-onayla <aktivasyon-kodu> komutunu çalıstırarak üyeliğini onaylayabilirsin` +
            `\nhttps://pano.kamp.us/login adresinden giriş yaptıktan sonra şifreni değiştirmeni öneririz` +
            `\n:tada::tada:  ${bold("pano.kamp.us'e hosgeldin!")}  :tada::tada:`
        );
    }
  },
};

export default info;
