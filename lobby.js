const Player = require('./player.js');

const Lobby = {
  debug_mode: true, // if true, one user can join a game several times

  running_games: new Map(),

  init(client, games) {
    this.client = client;
    this.games = games;
  },

  generate_message(user, game, players) {
    let message = '<@' + user.id + '> wants to play ' + game.name + '. ' + game.emoji + '\n' +
                  'Waiting for **' + game.min_players + ' to ' + game.max_players + '** players.\n' +
                  'Join the game and choose your avatar by adding a reaction to this message.\n' +
                  '✅ → start the game.\n' +
                  '❓ → display the rules.\n' +
                  '❌ → cancel the game.';
    if (players.length) {
      message += '\n> Players:';
      for (player of players)
        message += '\n> ' + player.avatar.toString() + ' <@' + player.user.id + '>';
    }

    if (game.min_players <= players.length && players.length <= game.max_players)
      message += '\n**Game is ready !**';

    return message;
  },

  async play(game_name, user, channel) {
    if (this.running_games.has(channel)) {
      channel.send('A game is already running on this channel.');
      return;
    }

    const game = this.games[game_name];
    if (game == undefined) {

      let message = 'Here are the games I can play with you:\n';
      let emoji_list = [];
      for (let [key, value] of Object.entries(this.games)) {
        message += value.emoji + ' ' + value.name + '    ||`!play ' + key +  '`||\n';
        emoji_list.push(value.emoji);
      }
      const sent_message = await channel.send(message);
      const promises = emoji_list.map(emoji => sent_message.react(emoji));
      await Promise.all(promises);

      const filter = (reaction, reaction_user) => {
        return emoji_list.includes(reaction.emoji.name) && reaction_user.id === user.id;
      };

      const collected = await sent_message.awaitReactions(filter, { max: 1 });
      const reaction = collected.first();
      for (let [key, value] of Object.entries(this.games)) {
        if (value.emoji === reaction.emoji.name)
          this.play(key, user, channel);
      }

    } else {

      let players = [];

      const sent_message = await channel.send(this.generate_message(user, game, players));
      await sent_message.react('✅');
      await sent_message.react('❓');
      await sent_message.react('❌');

      const collector = sent_message.createReactionCollector((reaction, reaction_user) => reaction_user.id != this.client.user.id, {dispose: true});
      this.running_games.set(channel, collector);

      collector.on('collect', async (reaction, reaction_user) => {
        const a = reaction.emoji;
        if (a.name == '✅') {
          if (game.min_players <= players.length && players.length <= game.max_players) {
            collector.stop();
            channel.send('Starting a game of ' + game.name + '. ' + game.emoji);
            const game_instance = new game(players, channel);
            await channel.setTopic('Playing ' + game.name + ' ' + game.emoji);
            await game_instance.start();
            await channel.setTopic('');
            this.cancel(channel);
          }
        } else if (a.name == '❓') {
          await channel.send('Rules:\n' + game.rules());
        } else if (a.name == '❌') {
          collector.stop();
          sent_message.delete();
          this.cancel(channel);
        } else {
          let allowed = players.reduce((acc, player) => acc && (player.avatar != a && (player.user != reaction_user || this.debug_mode)), true);
          if (allowed) {
            players.push(new Player(reaction_user, a));
            sent_message.edit(this.generate_message(user, game, players));
          }
        }
      });

      collector.on('remove', (reaction, reaction_user) => {
        const a = reaction.emoji;
        players = players.filter(player => !(player.avatar == a && player.user == reaction_user));
        sent_message.edit(this.generate_message(user, game, players));
      });
    }
  },

  cancel(channel) {
    channel.send('The game has been cancelled');
    if (this.running_games.has(channel))
      this.running_games.get(channel).stop();
    this.running_games.delete(channel);
  }
}

module.exports = Lobby;
