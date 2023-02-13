import { SlashCommandBuilder } from '@discordjs/builders';

export default {
  data: new SlashCommandBuilder().setName('kill').setDescription('Stop the world'),
  run: async ({ client, interaction }) => {
    let guildQueue = client.player.getQueue(interaction.guild.id);
    if (!guildQueue) {
      return interaction.editReply('Nothing to kill, budy.');
    }
    guildQueue.stop();
    await interaction.editReply("Okay! I'm leaving.. I'am leaving");
  },
};
