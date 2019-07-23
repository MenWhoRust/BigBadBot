import { ICommand, IKonachanPostsCollection } from './../interfaces/';
import axios from 'axios';
import { parseString } from 'xml2js';
import { RichEmbed } from 'discord.js';

const command: ICommand = {
    name: 'wall',
    description: 'Fetches random a random wallpaper from Konachan',
    execute: fetchWallpaper,
};

const baseUrl: string = 'https://konachan.com/post.xml?limit=1&page=';

export async function fetchWallpaper(
    args: string
): Promise<string | RichEmbed> {
    let tags = getTagsString(args);

    let postsCount = await getNumberOfPosts(tags);

    let page = Math.floor(Math.random() * (postsCount - 1)) + 1;
    console.log(page);

    let { data } = await axios.get(`${baseUrl}${page}&tags=${tags}`);
    let posts: IKonachanPostsCollection;

    posts = await parseXml(data);

    if (!posts.post) return Promise.reject('No Image could be found');
    let embed: RichEmbed = new RichEmbed();
    embed.setAuthor(posts.post.author);
    embed.setURL(posts.post.source);
    embed.setImage(posts.post.jpeg_url);
    embed.addField('Rating', getHumanReadableRating(posts.post.rating));
    embed.addField('Tags', posts.post.tags, false);
    return Promise.resolve(embed);
}

async function getNumberOfPosts(tags: string): Promise<number> {
    let queryUrl = `${baseUrl}1&tags=${tags}`;
    let { data } = await axios.get(queryUrl);

    return (await parseXml(data)).count;
}

function getTagsString(args: string): string {
    let argArr = args.split(' ').filter((s) => s != '');

    let ratingRegex = new RegExp(/\b(?!(?:.B)*(.)(?:B.)*\1)[sqe]+\b/i);

    let ratingArgs = argArr.find((se) => ratingRegex.test(se));

    let ratingString = '';
    if (ratingArgs) {
        ratingString = getRating(ratingArgs);
        argArr.splice(argArr.indexOf(ratingArgs), 1);
    }

    return ratingString + argArr.join('+');
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
