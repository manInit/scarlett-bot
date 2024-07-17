import ICommand from './command.interface';
import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import play from 'play-dl';

const musicCommand: ICommand = {
  builder: new SlashCommandBuilder()
    .setName('music')
    .setDescription('Play music!')
    .addStringOption((option) => {
      return option
        .setName('url')
        .setDescription('youtube video url')
        .setRequired(true);
    }),

  async execute(interaction: CommandInteraction): Promise<void> {
    const member = interaction.guild?.members.cache.get(
      interaction.member!.user.id!
    );
    if (!member || !member.voice.channelId || !interaction.guild) {
      return;
    }

    const connection = joinVoiceChannel({
      channelId: member.voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    const url = interaction.options.get('url')?.value?.toString();
    if (!url) {
      return;
    }

    const stream = await play.stream(url);
    const player = createAudioPlayer();
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    player.play(resource);
    connection.subscribe(player);

    if (interaction.isRepliable()) {
      await interaction.reply(url);
    }
  },
};

export default musicCommand;
