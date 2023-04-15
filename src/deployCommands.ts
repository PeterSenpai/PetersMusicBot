import * as dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { setupClient } from './getDiscordClient.js';
import * as fs from 'fs';
import { Client } from 'discord.js';

const DeployCommands = async (): Promise<Client> => {
  dotenv.config();

  const TOKEN = process.env.TOKEN;
  const APPLICATION_ID = process.env.APPLICATION_ID;
  const SERVER_ID = process.env.SERVER_ID;

  const client = setupClient();
  let commands = [];

  const slashFiles = await fs.readdirSync('./dist/slash').filter(file => file.endsWith('.js'));
  console.log(slashFiles);

  for (const file of slashFiles) {
    const { default: slashcmd } = await import(`./slash/${file}`);
    client.slashcommands.set(slashcmd.data.name, slashcmd);
    commands.push(slashcmd.data.toJSON());
  }

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  console.log('Deploying slash commands');
  rest
    .put(Routes.applicationGuildCommands(APPLICATION_ID, SERVER_ID), {
      body: commands,
    })
    .then(res => {
      console.log(commands);

      console.log('Deployment Succeeded');
    })
    .catch(err => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
  return client;
};

export { DeployCommands };
