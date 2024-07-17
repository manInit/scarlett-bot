import commands from './commands';
import './dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const TOKEN = process.env.TOKEN;

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = commands.find(
    (command) => command.builder.name === interaction.commandName
  );

  if (!command) {
    console.error('command not found error');
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
  }
});

client.login(TOKEN);
