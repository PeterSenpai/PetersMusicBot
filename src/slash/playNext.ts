import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';
import { RepeatMode } from 'discord-music-player';
import { getEmbedOfCurrentQueue } from '../getCurrentQueueMessage.js';

export default {
  data: new SlashCommandBuilder()
    .setName('playnext')
    .setDescription('Plays a song/songs from youtube.')
    .addStringOption(option => option.setName('url').setDescription('Youtube url').setRequired(true)),
  run: async ({ client, interaction }) => {
    let embed = new EmbedBuilder();
    let url = interaction.options.getString('url');
    let queue = client.player.createQueue(interaction.guild.id);
    await queue.join(interaction.member.voice.channel);
    let guildQueue = client.player.getQueue(interaction.guild.id);

    let song = await queue.play(url, { index: 0 }).catch(err => {
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

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
