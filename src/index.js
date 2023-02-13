import * as dotenv from 'dotenv';
import { DeployCommands } from './deployCommands.js';

dotenv.config();

const TOKEN = process.env.TOKEN;
const client = await DeployCommands();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', interaction => {
  async function handleCommand() {
    if (!interaction.isCommand()) return;

    const slashcmd = client.slashcommands.get(interaction.commandName);
    if (!slashcmd) interaction.reply('Not a valid slash command');
    await interaction.deferReply();
    await slashcmd.run({ client, interaction });
  }
  handleCommand();
});
client.login(TOKEN);

// for testing
// /add https://www.youtube.com/watch?v=CgvwIQfNCPo
// /add https://www.youtube.com/watch?v=V1Pl8CzNzCw
// /add https://www.youtube.com/watch?v=viimfQi_pUw
// /add https://www.youtube.com/watch?v=DyDfgMOUjCI
// /add https://www.youtube.com/playlist?list=PLh7jOgIfINLPUsV3K3avm0XrQOvudVmz7
// /playnext https://www.youtube.com/watch?v=HUHC9tYz8ik

// /add https://www.youtube.com/watch?v=KV75YuUM3Hg&list=RDMMKV75YuUM3Hg&start_radio=1
