'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const Lobby = require('./lobby.js')

client.on('ready', () => {
  console.log('I am ready!');
  Lobby.init(client,  {
    "timesbomb": require('./timesbomb.js'),
    "codenames": require('./codenames.js'),
    "coup": require('./coup.js'),
    "coinflip": require('./coinflip.js')
  }, process.argv[2] == "-debug");
});

// Create an event listener for messages
client.on('message', message => {
  if (message.content.substring(0, 1) == '!') {
    const args = message.content.substring(1).split(' ');
    const cmd = args[0];
    switch(cmd) {
      case 'play':
        Lobby.play(args[1], message.author, message.channel);
        break;
      case 'cancel':
        Lobby.cancel(message.channel);
        break;
      case 'pause':
        message.channel.send(':bell: @everyone C\'est la pause !!! :bell:');
        break;
      case 'count':
        const now = Date.now();
        const start = new Date(2020, 2, 16);
        console.log(start);
        const nb_days = Math.round((now - start) / 86400000);
        const digits = nb_days.toString().split('').map(c => parseInt(c));
        const emojis = digits.map(n => ["\u0030\u20E3", "\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3","\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"][n]);
        message.channel.setTopic('Jour ' + emojis.join(' '));
        break;
      default:
        message.channel.send('Unknown command');
        break;
    }
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications
client.login(require('./auth.json').token);
