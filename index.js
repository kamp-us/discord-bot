import { DISCORD_TOKEN, GUILD_ID } from "./config.js";
import { createDiscordClient } from "./createDiscordClient.js";

const client = await createDiscordClient();

const isUserInThisGuild = async (userID, guildID) => {
  const guild = await client.guilds.fetch(guildID);

  try {
    await guild.members.fetch(userID);
    return true;
  } catch (error) {
    return false;
  }
};

client.on("interactionCreate", async (interaction) => {
  const userID = interaction.user.id;
  const isUserInKampus = await isUserInThisGuild(userID, GUILD_ID);

  if (!isUserInKampus) {
    return;
  }

  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.default.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error trying to execute that command!",
      ephemeral: true,
    });
  }
});

// Login to Discord with your client's token
client.login(DISCORD_TOKEN).then(() => {
  console.log("Logged in!");
});
