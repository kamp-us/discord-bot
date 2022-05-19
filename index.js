import { DISCORD_TOKEN } from "./config.js";
import { createDiscordClient } from "./createDiscordClient.js";

const client = await createDiscordClient();

client.on("messageCreate", async (message) => {
  console.log(message, MESSAGE);
  if (message.content === "!ping") {
    await message.channel.send("Pong!");
  }
  // if (message.author.bot) return;
  // if (message.content.startsWith("!")) {
  //   const command = message.content.slice(1);
  //   const commandHandler = client.commandHandlers.get(command);
  //   if (commandHandler) {
  //     await commandHandler(message);
  //   }
  // }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  console.log(interaction);

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
client.login(DISCORD_TOKEN);
