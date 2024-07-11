import ICommand from './command.interface';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const pingCommand: ICommand = {
  builder: new SlashCommandBuilder()
    .setName('pong')
    .setDescription('Replies with Pong!'),

  async execute(interaction: CommandInteraction): Promise<void> {
    if (interaction.isRepliable()) {
      await interaction.reply('Pong!');
    }
  },
};

export default pingCommand;
