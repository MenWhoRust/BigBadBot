import env from './env';
import { Client, Message } from 'discord.js';
import Handler from './classes/CommandHandler';
const client = new Client();

const talkedRecently = new Set();

client.once('ready', () => {
    console.log('Ready');
});

client.on('message', (message: Message) => {
    if (!message.content.startsWith(env.prefix) || message.author.bot) return;

    // if (talkedRecently.has(message.author.id)) {
    //     message.channel.send(
    //         'Wait 1 minute before getting typing this again. - ' +
    //             message.author
    //     );
    // } else {
    Handler(message.content.substring(message.content.indexOf(env.prefix) + 1))
        .then((s) => message.channel.send(s))
        .catch((e) => message.channel.send(`${message.author} ${e}`));
    // the user can type the command ... your command code goes here :)

    //     // Adds the user to the set so that they can't talk for a minute
    //     talkedRecently.add(message.author.id);
    //     setTimeout(() => {
    //         // Removes the user from the set after a minute
    //         talkedRecently.delete(message.author.id);
    //     }, 60000);
    // }
});

client.login(env.key);
