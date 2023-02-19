import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';
import { getEmbedOfCurrentQueue } from '../getCurrentQueueMessage.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rm')
    .setDescription('rm -rf')
    .addStringOption(option => option.setName('index').setDescription('index to remove').setRequired(true)),

  run: async ({ client, interaction }) => {
    let guildQueue = client.player.getQueue(interaction.guild.id);
    let index = interaction.options.getString('index');
    const songRemoved = guildQueue.remove(parseInt(index));

    return await interaction.editReply({
      embeds: [
        new EmbedBuilder().setDescription(`**${songRemoved.name} has been removed!**`).setThumbnail(songRemoved.thumbnail),
        await getEmbedOfCurrentQueue(client, interaction, 1000),
      ],
    });
  },
};
