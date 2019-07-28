using System;
using System.Threading.Tasks;
using Discord;
using Discord.Commands;
using Discord.WebSocket;

namespace BigBadBot
{
    class Program
    {
        static void Main(string[] args) => new Program().MainAsync().GetAwaiter().GetResult();
        private DiscordSocketClient _client;
        private CommandService _commands;
        public async Task MainAsync()
        {
            _client = new DiscordSocketClient();
            _commands = new CommandService();
            var handler = new CommandHandler(_client, _commands);

            await handler.InstallCommandsAsync();
            await _client.LoginAsync(TokenType.Bot, Environment.GetEnvironmentVariable("DiscordToken"));

            await _client.StartAsync();
          

            await Task.Delay(-1);
        }
        
    }
}