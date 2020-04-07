const assert = require('assert');
const Deck = require('./deck.js');
const Player = require('./player.js');

module.exports = class Coup {
  static name = "Coup";
  static emoji = "🎖️";
  static min_players = 0;
  static max_players = 6;

  static characters = [
    {
      name: "Duke",
      emoji: "🤵",
      display: ":man_in_tuxedo: **` Duke:       `**",
      influence: "Take 3 coins from the Treasury. Block someone from taking foreign aid."
    },
    {
      name: "Assassin",
      emoji: "🕵️‍♀️",
      display: ":woman_detective: **` Assassin:   `**",
      influence: "Pay 3 coins and try to assassinate another player’s character."
    },
    {
      name: "Contessa",
      emoji: "👸",
      display: ":princess: **` Contessa:   `**",
      influence: "Block an assassination attempt against yourself."
    },
    {
      name: "Captain",
      emoji: '👨‍✈️',
      display: ":man_pilot: **` Captain:    `**",
      influence: "Take 2 coins from another player. Block someone from stealing coins from you."
    },
    {
      name: "Ambassador",
      emoji: "👳‍",
      display: ":man_wearing_turban: **` Ambassador: `**",
      influence: "Draw 2 character cards from the Court, choose which (if any) to exchange with your characters. Block someone from stealing coins from you."
    },
  ]

  static rules() {
    return "**TODO**";
  }

  constructor(players, channel) {
    assert(Coup.min_players <= players.length && players.length <= Coup.max_players,
      'CoinFlip.constructor: invalid number of players.');

    this.players = players;
    this.channel = channel;
  }

  update_board(message) {
    return message.edit('Players:\n' + this.players.map(player => player.mention() + '   ' + player.revealed.join('') + '   ' + ':yellow_circle:'.repeat(player.coins)).join('\n'));
  }

  async start() {

    const deck = new Deck();
    for (let character of Coup.characters)
      deck.add(character, 3);
    deck.shuffle();

    for (let player of this.players) {
      player.hand = deck.draw(2);
      player.revealed = [':grey_question:', ':grey_question:'];
      player.coins = 2;
    }

    const sent_players = await this.channel.send('Setting up the board');


    const sent_actions = await this.channel.send('Actions:\n'
      + '> **:yellow_circle: ` Income:     `**   Take 1 coin from the Treasury.\n'
      + '> **:moneybag: ` Foreign Aid:`**   Take 2 coin from the Treasury.\n'
      + '> **:military_medal: ` Coup:       `**   Pay 7 coins to launch a Coup against an opponent.\n');

    const sent_influence = await this.channel.send('Influence:\n'
      + Coup.characters.map(character => '> ' + character.display + '   ' + character.influence).join('\n'));



    for (let player of this.players)
      await sent_players.react(player.avatar.id ? player.avatar.id : player.avatar.name);
    await sent_actions.react('🟡');
    await sent_actions.react('💰');
    await sent_actions.react('🎖️');
    await sent_influence.react('🤵');
    await sent_influence.react('🕵️‍♀️');
    await sent_influence.react('👸');
    await sent_influence.react('👨‍✈️');
    await sent_influence.react('👳‍♂️');

    await this.update_board(sent_players);

    let current_player = this.players[Math.floor(Math.random() * this.players.length)];
    const sent_turn = await this.channel.send(current_player.mention() + ', it\'s your turn. Choose your action or influence.');

    const action_collector = sent_actions.createReactionCollector((reaction, user) => user.id == current_player.user.id);

    action_collector.on('collect', async (reaction, user) => {
      switch (reaction.emoji.name) {
        case '🟡':
          current_player.coins += 1;
          await this.update_board(sent_players);
          break;
        default:
          break;
      }
    });

    const sent_challenge = await this.channel.send('Other players, you have 20 seconds to challenge ' + current_player.mention() + '\'s influence with 🛑. You may also use your own influence.');
    await sent_challenge.react('🛑');
    await sent_challenge.react('✅');



    return new Promise(async (resolve, reject) => {
      resolve()
    });
  }
}
