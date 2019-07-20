import { ICommand, IKonachanPostsCollection } from './../interfaces/';
import axios from 'axios';
import { parseString } from 'xml2js';
import { RichEmbed } from 'discord.js';
import { randomBytes } from 'crypto';

const command: ICommand = {
    name: 'wall',
    description: 'Fetches random a random wallpaper from Konachan',
    handler: fetchWallpaper,
};

const baseUrl: string = 'https://konachan.com/post.xml?limit=1&page=';

export async function fetchWallpaper(args: string): Promise<RichEmbed> {
    let { data } = await axios.get(baseUrl);
    let posts: IKonachanPostsCollection;

    posts = await parseXml(data);

    let embed: RichEmbed = new RichEmbed();
    embed.setAuthor(posts.post.author);
    embed.setURL(posts.post.source);
    embed.setImage(posts.post.file_url);
    embed.addField('Rating', getHumanReadableRating(posts.post.rating));
    embed.addField('Tags', posts.post.tags, false);
    return embed;
}

function getHumanReadableRating(rating: string): string {
    switch (rating) {
        case 's':
            return 'Safe';
        case 'q':
            return 'Questionable';
        case 'e':
            return 'Explicit';
        default:
            return '';
    }
}

function getRating(flags: string): string {
    let flagArr = getFlagArray(flags);
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

function getFlagArray(query: string): number[] {
    return [
        Number(query.includes('s')),
        Number(query.includes('q')),
        Number(query.includes('e')),
    ];
}
function parseXml(strToParse: string): Promise<IKonachanPostsCollection> {
    return new Promise<IKonachanPostsCollection>((resolve, reject) => {
        parseString(
            strToParse,
            { mergeAttrs: true, explicitArray: false, explicitRoot: false },
            (err, result: IKonachanPostsCollection) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
}
export default command;
