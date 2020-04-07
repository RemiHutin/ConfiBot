const assert = require('assert');
const Deck = require('./deck.js');
const Player = require('./player.js');

module.exports = class CoinFlip {
  static name = "CoinFlip Battle Royale";
  static emoji = "🎲";
  static min_players = 1;
  static max_players = 100;

  static rules() {
    return "Enter the arena of the most *epic* battle royale ever created. Only one will survive...";
  }

  constructor(players, channel) {
    assert(CoinFlip.min_players <= players.length && players.length <= CoinFlip.max_players,
      'CoinFlip.constructor: invalid number of players.');

    this.players = players;
    this.channel = channel;
  }

  start() {
    return new Promise(async (resolve, reject) => {
      let sent = await this.channel.send('Flipping the coins...');

      const deck = new Deck();
      deck.add(this.players);
      deck.shuffle();

      setTimeout(() => {
        const winner = deck.draw()[0];
        sent.edit('Flipping the coins... ' + winner.mention() + ' wins!');
        resolve();
      }, 3000);
    });
  }
}
