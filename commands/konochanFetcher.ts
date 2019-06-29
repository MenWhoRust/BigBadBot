import { ICommand, IKonachanPostsCollection } from './../interfaces/';
import axios from 'axios';
import { parseString } from 'xml2js';

const command: ICommand = {
    name: 'wall',
    description: 'Fetches random a random wallpaper from Konachan',
    handler: fetchWallpaper,
};

const baseUrl: string = 'https://konachan.com/post.xml?limit=1&page=';

export async function fetchWallpaper(args: string): Promise<string> {
    let { data } = await axios.get(baseUrl);

    console.log(data);
    parseString(
        data,
        { mergeAttrs: true, explicitArray: false, explicitRoot: false },
        (err, result: IKonachanPostsCollection) => {
            console.log(result.count);
        }
    );

    return '';
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

export default command;
