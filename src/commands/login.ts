import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { NEXTAUTH_URL } from "../../config";

const login = {
  data: new SlashCommandBuilder()
    .setName("login")
    .setDescription("kampus hesabina giris yapmak icin kullanilir"),
  async execute(interaction: CommandInteraction) {
    const github = new ButtonBuilder()
      .setLabel("Sign in with GitHub")
      .setURL(`${NEXTAUTH_URL}/signin/github`)
      .setStyle(ButtonStyle.Link);

    const discord = new ButtonBuilder()
      .setLabel("Sign in with Discord")
      .setURL(`${NEXTAUTH_URL}/signin/discord`)
      .setStyle(ButtonStyle.Link);

    const twitch = new ButtonBuilder()
      .setLabel("Sign in with Twitch")
      .setURL(`${NEXTAUTH_URL}/signin/twitch`)
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(github, discord, twitch);

    await interaction.reply({
      content: `Please select which action you would like to take.`,
      components: [row],
    });
  },
};

export default login;
