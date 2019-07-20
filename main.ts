import env from './env';
import { Client, Message } from 'discord.js';
import { fetchWallpaper } from './commands/konochanFetcher';
const client = new Client();

client.once('ready', () => {
    console.log('Ready');
});

client.on('message', (message: Message) => {
    if (!message.content.startsWith(env.prefix) || message.author.bot) return;
    fetchWallpaper('').then((s) => message.channel.send(s));
});

client.login(env.key);

fetchWallpaper('');
