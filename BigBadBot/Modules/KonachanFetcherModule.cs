using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Serialization;
using BigBadBot.Helpers;
using BigBadBot.Models;
using Discord;
using Discord.Commands;

namespace BigBadBot.Modules
{
    public class KonachanFetcherModule: ModuleBase<SocketCommandContext>
    {
        private const string BASE_URL = "https://konachan.com/post.xml?limit=1&page=";


        [Command("wall")]
        public async Task FetchWallpaper(params string[] args)
        {
            string tags = GetTagsString(args.ToList());

            int postCount = (await GetPosts(tags))?.Count ?? 0;
            if (postCount <= 0)
            {
                throw new Exception("No posts found with the given tag");
            }


            int page = new RealRandom().Next(postCount);

            KonachanRoot posts = await GetPosts(tags, page);

            Embed embed = new EmbedBuilder()
                .WithImageUrl(posts.KonachanPost.FileUrl)
                .WithDescription(posts.KonachanPost.Tags)
                .Build();


            await ReplyAsync(embed: embed);

        }

        private async Task<KonachanRoot> GetPosts(string tags, int page = 1)
        {
            string queryUrl = $"{BASE_URL}{page}&{tags}";
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage responseMessage = await client.GetAsync(queryUrl);

                    if (!responseMessage.IsSuccessStatusCode) return null;

                    KonachanRoot konachanRoot = XmlHelper.DeserializeFromXmlString<KonachanRoot>(await responseMessage.Content.ReadAsStringAsync());
                    return konachanRoot;

                }

        }

        private string GetTagsString(List<string> args)
        {
            Regex ratingRegex = new Regex(@"\b(?!(?:.B)*(.)(?:B.)*\1)[sqe]+\b");
            string ratingArgs = args.FirstOrDefault(s => ratingRegex.IsMatch(s)) ?? "";

            if (!string.IsNullOrWhiteSpace(ratingArgs))
            {
                args.Remove(ratingArgs);
                args.TrimExcess();
            }



            string ratingString = string.Empty;

            if (!string.IsNullOrWhiteSpace(ratingArgs))
            {
                ratingString = GetRating(ratingArgs);
            }

            string tags = string.Empty;
            if (args.Count > 0)
                tags = string.Join('+', args);

            if (!string.IsNullOrWhiteSpace(tags) && !string.IsNullOrWhiteSpace(ratingString))
                tags = "+" + tags;



            return "tags=" +  ratingString + tags;

        }

        private string GetRating(string ratingArgs)
        {
            int[] flagArr = GetFlagArray(ratingArgs);
            if (flagArr.Length > 3) return "";

            char[] konaFlags = {'s', 'q', 'e'};

            int sum = flagArr.Aggregate(0, (a, b) => a+b);
            bool isNoTagRequired = sum == 3 || sum == 0;
            bool isNegated = sum == 2;

            if (isNoTagRequired) return "";

            string rating = isNegated ? "-" : "";
            rating += "rating:";
            rating += konaFlags[isNegated ? Array.IndexOf(flagArr, 0) : Array.IndexOf(flagArr, 1)];

            return rating;

        }

        private int[] GetFlagArray(string ratingArgs)
        {
            return new []
            {
                Convert.ToInt32(ratingArgs.Contains("s")),
                Convert.ToInt32(ratingArgs.Contains("q")),
                Convert.ToInt32(ratingArgs.Contains("e"))
            };
        }
    }
}
