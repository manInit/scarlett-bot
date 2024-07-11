import ICommand from './command.interface';
import {
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import ytdl from 'ytdl-core-discord';

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

    const connection = joinVoiceChannel({
      channelId: member!.voice.channelId!,
      guildId: interaction.guild!.id,
      adapterCreator: interaction.guild!.voiceAdapterCreator,
    });

    const url = interaction.options.get('url')?.value?.toString();
    const stream = await ytdl(url!);
    const resource = createAudioResource(stream);
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    player.play(resource);
    connection.subscribe(player);

    if (interaction.isRepliable()) {
      await interaction.reply(url!);
    }
  },
};

export default musicCommand;
