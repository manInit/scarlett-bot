import { CommandInteraction, SlashCommandOptionsOnlyBuilder } from 'discord.js';

interface ICommand {
  builder: SlashCommandOptionsOnlyBuilder;
  execute(interaction: CommandInteraction): Promise<void>;
}

export default ICommand;
