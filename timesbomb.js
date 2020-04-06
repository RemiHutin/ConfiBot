const assert = require('assert');
const Deck = require('./deck.js')

function mention_player(player) {
  return player.avatar.toString() + ' <@' + player.user.id + '>';
}

function same_emoji(a1, a2) {
  if (a1.id == null && a2.id == null)
    return a1.name == a2.name;
  return a1.id == a2.id;
}

module.exports = class TimesBomb {

  static name = "Times Bomb";
  static emoji = "💥";
  static min_players = 4;
  static max_players = 8;


  constructor(players, channel) {
    this.players = players;
    this.channel = channel;
    this.wires_left = players.length;

    assert(TimesBomb.min_players <= this.players.length &&
           this.players.length <= TimesBomb.max_players,
           'TimesBomb.constructor: invalid number of players.');
  }




  async start() {

    // Assign roles to every player
    let roles = new Deck;
    roles.add(':blue_square: Sherlock :blue_square:', Math.round(this.players.length / 1.5));
    roles.add(':red_square: Moriarty :red_square:', Math.round(this.players.length / 2.5));
    roles.shuffle();

    assert(roles.size() >= this.players.length, 'TimesBomb.start: not enough roles.');

    const sent_message = await this.channel.send('Sending roles...');
    const promises = this.players.map(player => {
      player.role = roles.draw();
      return player.user.send('Hello ' + mention_player(player) + '\nYour team: ' + player.role);
    });

    await Promise.all(promises);
    sent_message.delete();

    // Init deck of wires
    const deck = new Deck();
    deck.add('💥');
    deck.add('✂️', this.players.length);
    deck.add('⬜', this.players.length*4-1);
    deck.shuffle();

    const current_player = this.players[Math.floor(Math.random() * this.players.length)];
    const winner = await this.round(deck, current_player);

    // Game over message
    if (winner == "Moriarty")
      await this.channel.send("https://tenor.com/view/explode-blast-blow-nuclear-boom-gif-15025770");
    await this.channel.send('Game Over!\nTeam ' + winner + ' wins!\n' +
      ':blue_square: Team Sherlock :blue_square: : ||' + this.players.filter(player => player.role == ':blue_square: Sherlock :blue_square:').map(player => mention_player(player)).join('||, ||') + '||\n' +
      ':red_square: Team Moriarty :red_square: : ||' + this.players.filter(player => player.role == ':red_square: Moriarty :red_square:').map(player => mention_player(player)).join('||, ||') + '||');
  }




  async round(deck, current_player) {
    assert(deck.size() % this.players.length == 0, 'TimesBomb.round: incompatible number of players and deck size.');

    const current_hand_size = deck.size() / this.players.length;
    const current_round = 6-current_hand_size;

    // The bomb explodes at the beginning of round #5
    if (current_round == 5)
      return 'Moriarty';

    // Deal the wire cards between the players
    for (let player of this.players) {
      const hand = deck.draw(current_hand_size);
      player.hand = hand;
      player.revealed = [];
      for (let i = 0; i < hand.length; i++)
        player.revealed.push(':grey_question:');
    }
    assert(deck.is_empty(), 'TimesBomb.round: cards left in deck.');

    // Send messages with hands to the players
    const sent_message = await this.channel.send('**Round (' + current_round + '/4)** - Sending hands...');
    const promises = this.players.map(player => {
      return player.user.send('**Round (' + current_round + '/4)** - This is your hand:\n' + player.hand.join(''));
    });
    await Promise.all(promises);
    await sent_message.edit('**Round (' + current_round + '/4)**');

    // Start first cut of the round
    return this.cut(current_player, 1);
  }




  async cut(current_player, current_cut) {

    // After last cut of the round, retrieve all the cards, and start next round
    if (current_cut > this.players.length) {
      let deck = new Deck();
      for (let player of this.players) {
        deck.add(player.hand);
        player.hand = [];
      }
      deck.shuffle();
      return this.round(deck, current_player);
    }
    assert(this.players.includes(current_player), 'TimesBomb.cut: Invalid current player.');

    // Send global message to current player
    let message = '**Cut (' + current_cut + '/' + this.players.length + ')**';
    for (let player of this.players) {
      const hand = player.hand;
      message += '\n' + player.avatar.toString() + ' : ' + player.revealed.join('');
    }
    message += '\n Your need to find **' + this.wires_left + '** :scissors: to defuse the bomb.';
    message += '\n' + mention_player(current_player) + ' : it\'s your turn. Cut a wire in someone else\'s hand.';

    const sent_message = await this.channel.send(message);

    // Other players available
    let other_players = this.players.filter(player => player != current_player && player.hand.length > 0);
    assert(other_players.length > 0, "timesBombCut: no available target");

    // Add other players' emoji to the message
    const promises = other_players.map(player => sent_message.react(player.avatar.id ? player.avatar.id : player.avatar.name));
    await Promise.all(promises);

    // Await reaction from current player
    const filter = (reaction, user) => {
      return user.id === current_player.user.id                                   // reaction trigerred by current player
          && other_players.filter(player => same_emoji(player.avatar, reaction.emoji)).length > 0; // reaction targets a valid player
    };
    const collected = await sent_message.awaitReactions(filter, { max: 1 });
    await sent_message.delete(); // remove the message

    // Select random card in selected player's hand and remove it
    const reaction = collected.first();
    let selected_avatar = reaction.emoji;
    let selected_player = other_players.filter(player => same_emoji(player.avatar, selected_avatar))[0];
    let random_index = Math.floor(Math.random()*selected_player.hand.length);
    let selected_wire = selected_player.hand.splice(random_index, 1)[0];
    let hand_index = random_index;
    for (let i = 0; i < random_index; i++)
      hand_index += (selected_player.revealed[random_index] != ':grey_question:');
    selected_player.revealed[hand_index] = selected_wire;

    await this.channel.send('**Cut (' + current_cut + '/' + this.players.length + ')** - ' +
                            mention_player(current_player) + ' cuts a wire in ' +
                            mention_player(selected_player) + '\'s hand: ' + selected_wire);

    if (selected_wire == '💥') {
      return 'Moriarty';
    } else if (selected_wire == '✂️') {
      this.wires_left -= 1;
      if (this.wires_left == 0)
        return 'Sherlock';
    }

    // Start next cut
    return this.cut(selected_player, current_cut+1);
  }
}
