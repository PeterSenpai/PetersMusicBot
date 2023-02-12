import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import { getEmbedOfCurrentQueue } from "../getCurrentQueueMessage.js";

export default {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays info about the currently playing song"),
    run: async ({ client, interaction }) => {
        const guildQueue = client.player.getQueue(interaction.guildId);

        if (!guildQueue)
            return await interaction.editReply(
                "There are no songs in the queue"
            );

        const embed = await getEmbedOfCurrentQueue(client, interaction, 0);
        let bar = guildQueue.createProgressBar();
        const song = guildQueue.nowPlaying;
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setThumbnail(song.thumbnail)
                    .setDescription(
                        `**Currently Playing [${song.name}](${song.url})**\n\n` +
                            bar.prettier
                    ),
                embed,
            ],
        });
    },
};
