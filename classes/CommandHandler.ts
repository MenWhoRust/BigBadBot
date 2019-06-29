import { ICommand } from './../interfaces/';

class CommandHandler {
    //Create a collection of commands(KeyValue pairs)
    //Key = command name, value = function(args)
    constructor() {}

    private CommandCollection: ICommand[] = [];
    //User sends command
    //We get the root command
    //substring(indexOf(prefix), indexOf(' '))
    //search for if the root command exists in collection
    //The first entry that matches pass the rest of the command as arguments
}
