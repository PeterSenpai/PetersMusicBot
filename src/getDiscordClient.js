import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Player } from "discord-music-player";

const setupClient = () => {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    });

    client.slashcommands = new Collection();
    client.player = new Player(client, { leaveOnEmpty: true });
    return client;
};

export { setupClient };
