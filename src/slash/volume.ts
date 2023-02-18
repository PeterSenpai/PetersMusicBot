import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('vol')
    .setDescription('Volume stuff')
    .addSubcommand(subcommand => subcommand.setName('get').setDescription('get the current volume'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('set volume')
        .addStringOption(option =>
          option.setName('percentage').setDescription('percentage').setRequired(true)
        )
    ),
  run: async ({ client, interaction }) => {
    let guildQueue = client.player.getQueue(interaction.guild.id);
    if (interaction.options.getSubcommand() === 'get') {
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(`The current volume is ${guildQueue.volume}`)],
      });
    } else if (interaction.options.getSubcommand() === 'set') {
      let percentage = interaction.options.getString('percentage');
      guildQueue.setVolume(parseInt(percentage));
      await interaction.editReply({
        embeds: [
          new EmbedBuilder().setDescription(`Setting the volume to ${parseInt(percentage)}`),
        ],
      });
    }
  },
};
