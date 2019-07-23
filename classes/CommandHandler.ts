import { ICommand } from './../interfaces/';
import commands from '../commands';
import { RichEmbed } from 'discord.js';
//Create a collection of commands(KeyValue pairs)
//Key = command name, value = function(args)

let CommandCollection: ICommand[] = commands;
//User sends command
//We get the root command
//substring(indexOf(prefix), indexOf(' '))
//search for if the root command exists in collection
//The first entry that matches pass the rest of the command as arguments

export = function handleCommand(command: string): Promise<string | RichEmbed> {
    let index = command.indexOf(' ');

    let rootCommand = index === -1 ? command : command.substring(0, index);
    let args = index === -1 ? '' : command.substring(command.indexOf(' '));
    let foundCommand = CommandCollection.find((c) => c.name == rootCommand);

    if (foundCommand) {
        return foundCommand.execute(args);
    } else {
        return Promise.resolve('Command could not be found');
    }
};
