using System;
using System.Reflection;
using System.Threading.Tasks;
using Discord.Commands;
using Discord.WebSocket;

namespace BigBadBot
{
    public class CommandHandler
    {
        private readonly DiscordSocketClient _client;
        private readonly CommandService _commands;

        public CommandHandler(DiscordSocketClient client, CommandService commands)
        {
            _commands = commands;
            _client = client;
        }

        public async Task InstallCommandsAsync()
        {
            _client.MessageReceived += ClientOnMessageReceived;

            await _commands.AddModulesAsync(Assembly.GetEntryAssembly(), services: null);
        }

        private async Task ClientOnMessageReceived(SocketMessage arg)
        {
            if(!(arg is SocketUserMessage message)) return;

            var argPos = 0;
            
            if(!(message.HasStringPrefix(">>", ref argPos) || message.HasMentionPrefix(_client.CurrentUser, ref argPos)) || message.Author.IsBot)
                return;
            
            var context = new SocketCommandContext(_client, message);
            await context.Channel.TriggerTypingAsync();

            try
            {
                if(_commands.Search(context, argPos).IsSuccess)
                    await _commands.ExecuteAsync(context, argPos, null);
                else
                    await context.Channel.SendMessageAsync(
                        $"{message.Author.Mention} Sorry I don't know what that means");
                
            }
            catch (Exception e)
            {
                await context.Channel.SendMessageAsync($"{message.Author.Mention} {e}");
            }

        }
    }
}