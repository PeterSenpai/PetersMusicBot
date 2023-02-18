import { Collection } from 'discord.js';
import { Player } from 'discord-music-player';

declare module 'discord.js' {
  export interface Client {
    slashcommands: Collection<unknown, any>;
    player: Player;
  }
}
