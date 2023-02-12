import { SlashCommandBuilder } from "@discordjs/builders";
import { getEmbedOfCurrentQueue } from "../getCurrentQueueMessage.js";

export default {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("displays the current song queue")
        .addNumberOption((option) =>
            option
                .setName("page")
                .setDescription("Page number of the queue")
                .setMinValue(1)
        ),

    run: async ({ client, interaction }) => {
        const guildQueue = client.player.getQueue(interaction.guildId);
        if (!guildQueue || !guildQueue.nowPlaying) {
            return await interaction.editReply(
                "There are no songs in the queue."
            );
        }

        const embed = await getEmbedOfCurrentQueue(client, interaction, 0);

        return await interaction.editReply({
            embeds: [embed],
        });
    },
};
