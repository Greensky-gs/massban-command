const Discord = require('discord.js');
const fs = require('fs');

const Client = new Discord.Client({
  Itents: [Discord.Intents.FLAGS.GUILD_MESSAGE]
});

client.commands = new Discord.Collection();

fs.readdirSync('./commands').forEach((dirs) => {
  fs.readdirSync(`./commands/${dirs}`).filter(x => x.endsWith('.js')).forEach((cmd) => {
    let prop = require(`./commands/${dirs}/${cmd}`);
    client.commands.set(prop.help.name, prop);
  });
});

const settings = {
  token: 'THE TOKEN OF YOUR BOT', //Don't forget to put the token
  prefix: '!'
};

client.on('messageCreate', (message) => {
  if (!message.content.startsWith(settings.prefix)) return;
  
  var args = message.content.slice(settings.prefix.length).trim().split(' ');
  const commandName = args.shift();
  
  const command = client.commands.get(commandName) || client.commands.find(x => x.help.aliases && x.help.aliases.includes(commandName));
  if (!command) return;
  
  command.run(message, args, client, settings.prefix);
});
