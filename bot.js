'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const Lobby = require('./lobby.js')

client.on('ready', () => {
  console.log('I am ready!');
  Lobby.init(client,  {
    "timesbomb": require('./timesbomb.js'),
    "codenames": require('./codenames.js')
  });
});


const Codenames = require('./codenames.js')
// Create an event listener for messages
client.on('message', message => {
  if (message.content.substring(0, 1) == '!') {
    const args = message.content.substring(1).split(' ');
    const cmd = args[0];
    let test = new Codenames([], message.channel);
    test.start();
    return;
    switch(cmd) {
      case 'play':
        Lobby.play(args[1], message.author, message.channel);
        break;
      case 'cancel':
        Lobby.cancel(message.channel);
        break;
      default:
        message.channel.send('Unknown command');
        break;
    }
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
var token = JSON.parse(fs.readFileSync('auth.json')).token;
client.login(token);
