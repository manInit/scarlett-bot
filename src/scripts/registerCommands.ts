import commands from '../commands';
import '../dotenv';
import { REST, Routes } from 'discord.js';

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commandsBuilders = commands.map((command) => command.builder);
console.log(commandsBuilders.map((c) => c.name));
const rest = new REST({ version: '10' }).setToken(TOKEN!);

async function start(): Promise<void> {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID!), {
      body: commandsBuilders,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

start();
