using System;
using System.Reflection;
using System.Threading.Tasks;
using DSharpPlus;
using DSharpPlus.CommandsNext;

namespace BigBadBot
{
    class Program
    {
        static void Main(string[] args) => new Program().MainAsync().GetAwaiter().GetResult();
        private DiscordClient _client;
        private CommandsNextModule _commands;
        public async Task MainAsync()
        {
            _client = new DiscordClient(new DiscordConfiguration
            {
                Token = Environment.GetEnvironmentVariable("DiscordToken"),
                TokenType = TokenType.Bot
            });
            _commands = _client.UseCommandsNext(new CommandsNextConfiguration
            {
                StringPrefix = ">>",
                
            });
            
            _commands.RegisterCommands(Assembly.GetExecutingAssembly());

            await _client.ConnectAsync();
          

            await Task.Delay(-1);
        }
        
    }
}