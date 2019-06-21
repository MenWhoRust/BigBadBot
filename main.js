import env from './env';

const Discord = require('discord.js');

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready');
});

client.login(env.key);

function getRating(flagArr = []) {
    const KonaFlags = ['s', 'q', 'e'];

    const sum = flagArr.reduce((a, b) => a + b, 0);
    const isNoTagRequired = sum == 3 || sum == 0;
    const isNegated = sum == 2;

    if (isNoTagRequired) return '';

    let rating = isNegated ? '-' : '';
    rating += 'rating:';
    rating += KonaFlags[isNegated ? flagArr.indexOf(0) : flagArr.indexOf(1)];

    return rating;
}
console.log(
    getRating([1, 1, 0]), // -e
    getRating([1, 0, 1]), // -q
    getRating([0, 1, 1]), // -s

    getRating([1, 0, 0]), // s
    getRating([0, 1, 0]), // q
    getRating([0, 0, 1]), // e

    getRating([1, 1, 1]), // nothing
    getRating([0, 0, 0]) // nothing
);
