import { GUILD_ID } from "../../config";

const interactionCreate = {
  name: "interactionCreate",
  async execute(interaction) {
    const isUserInThisGuild = async (userID: string, guildID: string) => {
      const guild = await interaction.client.guilds.fetch(guildID);

      try {
        await guild.members.fetch(userID);
        return true;
      } catch (error) {
        return false;
      }
    };

    const userID = interaction.user.id;
    const isUserInKampus = await isUserInThisGuild(userID, GUILD_ID);

    if (!isUserInKampus) {
      return;
    }

    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.default.execute(interaction, interaction.client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error trying to execute that command!",
        ephemeral: true,
      });
    }
  },
};

export default interactionCreate;
