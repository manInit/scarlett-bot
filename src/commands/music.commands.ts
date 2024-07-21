import ICommand from './command.interface';
import {
  createAudioPlayer,
  createAudioResource,
  generateDependencyReport,
  joinVoiceChannel,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
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
    const yt_info = await play.video_info(url);
    const stream = await play.stream_from_info(yt_info);
    const resourceTR = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    // const resource = createAudioResource(join(__dirname, 'test.wav'));
    const outputStream = fs.createWriteStream('audio.ogg');
    stream.stream.pipe(outputStream as any);
    outputStream.on('finish', () => {
      console.log('The audio data has been successfully saved to the file.');
    });

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });
    player.play(resourceTR);
    connection.subscribe(player);

    if (interaction.isRepliable()) {
      await interaction.reply(url);
    }
  },
};

export default musicCommand;
