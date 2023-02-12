import * as dotenv from "dotenv";
import { DeployCommands } from "./deployCommands.js";

dotenv.config();

const TOKEN = process.env.TOKEN;
const client = await DeployCommands();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", (interaction) => {
    async function handleCommand() {
        if (!interaction.isCommand()) return;

        const slashcmd = client.slashcommands.get(interaction.commandName);
        if (!slashcmd) interaction.reply("Not a valid slash command");
        await interaction.deferReply();
        await slashcmd.run({ client, interaction });
    }
    handleCommand();
});
client.login(TOKEN);

// for testing
// /play song https://www.youtube.com/watch?v=CgvwIQfNCPo
// /play song https://www.youtube.com/watch?v=V1Pl8CzNzCw
// /play song https://www.youtube.com/watch?v=viimfQi_pUw
// /play song https://www.youtube.com/watch?v=DyDfgMOUjCI
// /play song https://www.youtube.com/watch?v=HUHC9tYz8ik
// /play playlist https://www.youtube.com/playlist?list=PLh7jOgIfINLPUsV3K3avm0XrQOvudVmz7

// /play playlist https://www.youtube.com/watch?v=KV75YuUM3Hg&list=RDMMKV75YuUM3Hg&start_radio=1
