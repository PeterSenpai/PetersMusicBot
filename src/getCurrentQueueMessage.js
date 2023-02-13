import { EmbedBuilder } from 'discord.js';

const getEmbedOfCurrentQueue = async (client, interaction, timeout = 500) => {
  await new Promise(resolve => setTimeout(resolve, timeout));
  let { songs } = client.player.getQueue(interaction.guild.id);
  let displayMessage = '**Currently Playing**:\n';
  songs.forEach(({ name, duration }, index) => {
    if (displayMessage.length > 3900) {
      return;
    }
    if (index === 0) {
      displayMessage += `\n **[${duration}]** - ${name} \n\n**Next:** \n\n`;
    } else {
      displayMessage += `**${index}. [${duration}]** - ${name}\n`;
    }
  });
  return new EmbedBuilder().setDescription(displayMessage).setThumbnail(songs[0].thumbnail);
};

export { getEmbedOfCurrentQueue };
