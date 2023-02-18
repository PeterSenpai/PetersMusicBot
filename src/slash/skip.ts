import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';
import { getEmbedOfCurrentQueue } from '../getCurrentQueueMessage.js';

export default {
  data: new SlashCommandBuilder().setName('skip').setDescription('Skips the current song'),
  run: async ({ client, interaction }) => {
    let guildQueue = client.player.getQueue(interaction.guild.id);

    const skippedSong = guildQueue.skip();

    const embed = await getEmbedOfCurrentQueue(client, interaction, 1000);

    return await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`**${skippedSong.name} has been skipped!**`)
          .setThumbnail(skippedSong.thumbnail),
        embed,
      ],
    });
  },
};
