import * as dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { setupClient } from "./getDiscordClient.js";
import * as fs from "fs";

const DeployCommands = async () => {
    dotenv.config();

    const TOKEN = process.env.TOKEN;
    const APPLICATION_ID = process.env.APPLICATION_ID;
    const SERVER_ID = process.env.SERVER_ID;

    const client = setupClient();
    let commands = [];

    const slashFiles = fs
        .readdirSync("./src/slash")
        .filter((file) => file.endsWith(".js"));

    for (const file of slashFiles) {
        const { default: slashcmd } = await import(`./slash/${file}`);
        client.slashcommands.set(slashcmd.data.name, slashcmd);
        commands.push(slashcmd.data.toJSON());
    }

    const rest = new REST({ version: "10" }).setToken(TOKEN);
    console.log("Deploying slash commands");
    rest.put(Routes.applicationGuildCommands(APPLICATION_ID, SERVER_ID), {
        body: commands,
    })
        .then(() => {
            console.log("Deployment Succeeded");
        })
        .catch((err) => {
            if (err) {
                console.log(err);
                process.exit(1);
            }
        });
    return client;
};

export { DeployCommands };
