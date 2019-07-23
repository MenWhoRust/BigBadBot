import { RichEmbed } from 'discord.js';

export interface ICommand {
    name: string;
    description: string;
    execute(args: string): Promise<string | RichEmbed>;
}
