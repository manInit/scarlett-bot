import ICommand from './command.interface';
import {
  createAudioPlayer,
  createAudioResource,
  generateDependencyReport,
  joinVoiceChannel,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import youtubedl from 'youtube-dl-exec';

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play,
  },
});

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
    console.log(generateDependencyReport());
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
    await interaction.deferReply({ ephemeral: true });
    player.stop(true);
    if (existsSync(join(__dirname, 'music.mp3'))) {
      unlinkSync(join(__dirname, 'music.mp3'));
    }
    const fileName = await youtubedl(url, {
      noCheckCertificates: true,
      noWarnings: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
      extractAudio: true,
      audioFormat: 'mp3',
      output: join(__dirname, 'music.%(ext)s'),
    });
    if (!existsSync(join(__dirname, 'music.mp3'))) {
      await interaction.editReply('Ошибка');
      return;
    }
    const resource = createAudioResource(
      createReadStream(join(__dirname, 'music.mp3'))
    );
    console.log('create player');

    player.play(resource);
    connection.subscribe(player);
    if (interaction.isRepliable()) {
      await interaction.editReply(url);
    }
  },
};

export default musicCommand;
