import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';
import { RepeatMode } from 'discord-music-player';
import { getEmbedOfCurrentQueue } from '../getCurrentQueueMessage.js';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('loads songs from youtube')
    .addSubcommand(subcommand =>
      subcommand
        .setName('song')
        .setDescription('Loads a single song from a url')
        .addStringOption(option =>
          option.setName('url').setDescription("the song's url").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('playlist')
        .setDescription('Loads a playlist of songs from a url')
        .addStringOption(option =>
          option.setName('url').setDescription("the playlist's url").setRequired(true)
        )
    ),
  run: async ({ client, interaction }) => {
    let embed = new EmbedBuilder();
    let url = interaction.options.getString('url');

    if (interaction.options.getSubcommand() === 'song') {
      let queue = client.player.createQueue(interaction.guild.id);
      await queue.join(interaction.member.voice.channel);

      let guildQueue = client.player.getQueue(interaction.guild.id);
      let song = await queue.play(url).catch(err => {
        console.error('error on playing song action', err);
        if (!guildQueue) {
          queue.stop();
          console.log('current queue', guildQueue);
        }
      });

      if (!song) {
        return interaction.editReply('No song was found.');
      }

      guildQueue.setRepeatMode(RepeatMode.QUEUE);

      embed = await getEmbedOfCurrentQueue(client, interaction, 0);
    } else if (interaction.options.getSubcommand() === 'playlist') {
      let queue = client.player.createQueue(interaction.guild.id);
      await queue.join(interaction.member.voice.channel);
      let guildQueue = client.player.getQueue(interaction.guild.id);
      let playListMetaData = await queue.playlist(url).catch(err => {
        console.error('error on playing song action', err);
        if (!guildQueue) {
          queue.stop();
          console.log('current queue', guildQueue);
        }
      });

      if (!playListMetaData) {
        return interaction.editReply('No playlist was found.');
      }

      guildQueue.setRepeatMode(RepeatMode.QUEUE);

      embed = await getEmbedOfCurrentQueue(client, interaction, 0);
    } else if (interaction.options.getSubcommand() === 'search') {
      return interaction.editReply('Stay tune');
    }
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
