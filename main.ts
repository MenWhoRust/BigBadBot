import env from './env';
import { Client, Message } from 'discord.js';

const client = new Client();

client.once('ready', () => {
    console.log('Ready');
});

client.login(env.key);

function getRating(flagArr: number[]): string {
    if (flagArr.length > 3) return '';
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
let all = 'sqe';
let none = '';

let safe = 's';
let questionable = 'q';
let explicit = 'e';

let notSafe = 'qe';
let notQuestionable = 'se';
let notExplicit = 'sq';

function getFlagArray(query: string): number[] {
    return [
        Number(query.includes('s')),
        Number(query.includes('q')),
        Number(query.includes('e')),
    ];
}

console.log();
console.log(
    getRating(getFlagArray(notExplicit)), // -e
    getRating(getFlagArray(notQuestionable)), // -q
    getRating(getFlagArray(notSafe)), // -s

    getRating(getFlagArray(safe)), // s
    getRating(getFlagArray(questionable)), // q
    getRating(getFlagArray(explicit)), // e

    getRating(getFlagArray(all)), // nothing
    getRating(getFlagArray(none)) // nothing
);
