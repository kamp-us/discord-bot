import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v9";
import { GUILD_ID } from "../../config";
import { dynamicVoice } from "../structures/dynamicVoice";

const channelNameOptionName = "voice-channel-name";

const voice = {
  data: new SlashCommandBuilder()
    .setName("voice")
    .setDescription("Create Voice Channels")
    .addStringOption((option) =>
      option
        .setName(channelNameOptionName)
        .setDescription("Create dynamic voice channels.")
        .setRequired(true)
    ),

  async execute(interaction: any, client: any) {
    const guildId = interaction.guildId;

    const userId = interaction.user.id;

    if (guildId !== GUILD_ID) return;

    if (dynamicVoice.userHasChannels(userId)) {
      interaction.reply({ content: "You have already created a channel.", ephemeral: true });
      return;
    }

    const channelName = interaction.options.getString(channelNameOptionName);

    if (dynamicVoice.channelNameInUse(channelName)) {
      interaction.reply({ content: "This channel name is already in use.", ephemeral: true });
      return;
    }

    const guild = client.guilds.cache.get(guildId);

    const voiceChannelsCategoryCh = guild.channels.cache.find(
      (channel) => channel.name === "Dynamic Voice Channels"
    );

    // holdfast was here usirinParrot

    guild.channels
      .create(channelName, {
        parent: voiceChannelsCategoryCh,
        type: ChannelType.GuildVoice,
      })
      .then((channel) => {
        dynamicVoice.addChannel({
          channelId: channel.id,
          channelName: channelName,
          ownerId: userId,
        });

        interaction.reply({
          content: `Voice Channel "${channelName}" created.`,
          ephemeral: true,
        });
      })
      .catch((e) => {
        interaction.reply({
          content: `There was an error while creating Voice Channel "${channelName}". Error: ${e}`,
          ephemeral: true,
        });
      });
  },
};

export default voice;
