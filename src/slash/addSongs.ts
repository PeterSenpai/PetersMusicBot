import { SlashCommandBuilder } from '@discordjs/builders';
import { AutocompleteInteraction, Client, EmbedBuilder, Interaction, GuildMember, CommandInteraction } from 'discord.js';
import { RepeatMode } from 'discord-music-player';
import { getEmbedOfCurrentQueue } from '../getCurrentQueueMessage.js';

export default {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Plays a song/songs from youtube.')
    .addStringOption(option => option.setName('url').setDescription('Youtube url').setRequired(true)),
  run: async ({ client, interaction }: { client: Client; interaction: Interaction }) => {
    let embed = new EmbedBuilder();
    let url = (interaction as AutocompleteInteraction).options.getString('url');
    let queue = client.player.createQueue(interaction.guild.id);
    await queue.join((interaction.member as GuildMember).voice.channel);
    let guildQueue = client.player.getQueue(interaction.guild.id);
    const isAList = url.includes('list');

    if (!isAList) {
      let song = await queue.play(url).catch(err => {
        console.error('error on playing song action', err);
        if (!guildQueue) {
          queue.stop();
          console.log('current queue', guildQueue);
        }
      });

      if (!song) {
        return (interaction as CommandInteraction).editReply('No song was found.');
      }

      guildQueue.setRepeatMode(RepeatMode.QUEUE);
      embed = await getEmbedOfCurrentQueue(client, interaction, 0);
    } else {
      let playListMetaData = await queue.playlist(url).catch(err => {
        console.error('error on playing song action', err);
        if (!guildQueue) {
          queue.stop();
          console.log('current queue', guildQueue);
        }
      });

      if (!playListMetaData) {
        return (interaction as CommandInteraction).editReply('No playlist was found.');
      }

      guildQueue.setRepeatMode(RepeatMode.QUEUE);
      embed = await getEmbedOfCurrentQueue(client, interaction, 0);
    }
    await (interaction as CommandInteraction).editReply({
      embeds: [embed],
    });
  },
};
