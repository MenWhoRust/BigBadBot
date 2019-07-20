import { RichEmbed } from 'discord.js';

export interface ICommand {
    name: string;
    description: string;
    handler(
        args: string
    ): RichEmbed | string | Promise<string> | Promise<RichEmbed>;
}
