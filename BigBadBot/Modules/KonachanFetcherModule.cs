using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Serialization;
using BigBadBot.Enums;
using BigBadBot.Helpers;
using BigBadBot.Models;
using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.Entities;

namespace BigBadBot.Modules
{
    public class KonachanFetcherModule
    {
        private const string BASE_URL = "https://konachan.com/post.xml?limit=1&page=";


        [Command("wall")]
        [Cooldown(1, 5, CooldownBucketType.User)]
        public async Task FetchWallpaper(CommandContext ctx, params string[] args)
        {
            await ctx.TriggerTypingAsync();
            string tags = GetTagsString(args.ToList());

            int postCount = (await GetPosts(tags))?.Count ?? 0;
            if (postCount <= 0)
            {
                await ctx.RespondAsync("No posts found with the given tag");
                return;
            }

            int page = new RealRandom().Next(postCount);

            KonachanRoot posts = await GetPosts(tags, page);

            ERating rating = posts.KonachanPost.Rating switch
            {
                "e" => ERating.Explicit,
                "q" => ERating.Questionable,
                "s" => ERating.Safe,
                _ => ERating.Safe
            };

            DiscordEmbed embed = new DiscordEmbedBuilder()
                .WithImageUrl(posts.KonachanPost.FileUrl)
                .WithAuthor(posts.KonachanPost.Author)
                .WithDescription(
                    $"**Rating:** {rating}\n" +
                    $"**Score:** {posts.KonachanPost.Score}\n" +
                    $"**Tags:** {posts.KonachanPost.Tags}"
                    )
                .Build();


            await ctx.RespondAsync(embed: embed);

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
