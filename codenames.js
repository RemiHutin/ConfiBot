const assert = require('assert');
const Deck = require('./deck.js');
const Player = require('./player.js');

const Dict = require('./codenames_dict.json');




module.exports = class Codenames {
  static name = "Codenames";
  static emoji = "🕵️";
  static min_players = 4;
  static max_players = 8;

  static team_symbols = ['🟥', '🟦'];

  static rules() {
    return "The first two players to join the game are the spymasters.\n**TODO**";
  }

  constructor(players, channel) {
    this.players = players;
    this.channel = channel;

    assert(Codenames.min_players <= this.players.length &&
           this.players.length <= Codenames.max_players,
           'Codenames.constructor: invalid number of players.');

    this.spymasters = {'🟥': this.players[0], '🟦': this.players[1]};
    this.current_team = Codenames.team_symbols[Math.floor(Math.random()*2)];
    this.number_agents = {'🟥': 8, '🟦': 8};
    this.number_agents[this.current_team] += 1; // one more card for starting team

    this.current_clue = undefined;
    this.number_guesses = 0;
  }


  make_table(spymaster) {
    let text = 'Agents left:\n';
    for (let team of Codenames.team_symbols)
      text += team.repeat(this.number_agents[team]) + '\n';

    for (const [index, card] of this.cards.entries()) {
      let symbol = card.revealed || spymaster ? card.agent : card.letter;
      let modif = card.revealed ? '||' : '';
      if (index % 5 == 0)
        text += '\n\n';
      text += symbol + modif + '**` ' + card.word + ' `**' + modif + symbol + '      ';
    }

    return text + '\n\n⠀';
  }

  async assign_team() {
    let roles_deck = new Deck();

    for (let team of Codenames.team_symbols)
      this.spymasters[team].role = team + ' spymaster';

    roles_deck.add(Codenames.team_symbols[0], Math.ceil((this.players.length - 2) / 2));
    roles_deck.add(Codenames.team_symbols[1], Math.floor((this.players.length - 2) / 2));

    for (let player of this.players.slice(2))
      player.role = roles_deck.draw();


    assert(roles_deck.is_empty(), 'Codenames.assign_team: ' + roles_deck.size() + ' role(s) left.');

    let message = '';
    for (let team of Codenames.team_symbols) {
      message += team + ' Team\n';
      message += '> Spymaster: ' + this.spymasters[team].mention() + '\n';
      message += '> Spies: ' + this.players.filter(player => player.role == team).map(player => player.mention()).join(', ') + '\n';
    }
    await this.channel.send(message);

  }



  init_board(word_list) {

    let words_deck = new Deck();
    words_deck.add(word_list);
    words_deck.shuffle();

    const words = words_deck.draw(25);
    const length = Math.max(...words.map(word => word.length));


    let agents_deck = new Deck();
    for (let team of Codenames.team_symbols)
      agents_deck.add(team, this.number_agents[team]);
    agents_deck.add('⬜', 7);
    agents_deck.add('🕵️', 1);
    agents_deck.shuffle();

    const letters = [
      '🇦', '🇧', '🇨', '🇩', '🇪',
      '🇫', '🇬', '🇭', '🇮', '🇯',
      '🇰', '🇱', '🇲', '🇳', '🇴',
      '🇵', '🇶', '🇷', '🇸', '🇹',
      '🇺', '🇻', '🇼', '🇽', '🇾'
    ];

    this.cards = words.map(word => {
      const left = ' '.repeat(Math.ceil((length - word.length)/2));
      const right = ' '.repeat(length - word.length - left.length);
      return {
        word: left + word + right,
        agent: agents_deck.draw()[0],
        letter: letters.shift(),
        revealed: false
      }
    });
  }

  edit_clue_message() {
    const current_spymaster = this.spymasters[this.current_team];
    if (this.current_clue == undefined) {
      this.clue_message.edit('Waiting for a clue from ' + this.current_team + ' spymaster (' + current_spymaster.mention() + ')');
    } else {
      this.clue_message.edit(this.current_team + ' spymaster sent a clue!\n'
        + 'The clue word is: **' + this.current_clue.word + '**\n'
        + 'The clue number is: **' + this.current_clue.number + '**\n'
        + this.current_team + ' Team '
        + '(' + this.players.filter(player => player.role == this.current_team).map(player => player.mention()).join(', ') + '), '
        + 'you have **' + this.number_guesses + '** guess(es) left.'
        + (this.current_clue.word == 'Maïté' ? '\nhttps://tenor.com/view/ortolan-mistermv-derri%c3%a8re-ma%c3%aft%c3%a9-gif-16740074' : ''));
    }
  }

  async request_clue() {

    const current_spymaster = this.spymasters[this.current_team];
    const sent_message = await current_spymaster.user.send(current_spymaster.role + ', input your clue here. You need to input a word and a number, separated with a space (example : `WORD 2`)');
    const clue_collector = current_spymaster.user.dmChannel.createMessageCollector(m => m.author.id == current_spymaster.user.id);

    clue_collector.on('collect', async message => {
      const str = message.content;
      const words = str.split(' ');
      if (words.length != 2) {
        const sent_message2 = await message.reply('Invalid input, try again');
        setTimeout(() => sent_message2.delete(), 10000);
        return;
      }
      const number = parseInt(words[1]);
      if (isNaN(number)) {
        const sent_message2 = await message.reply('Invalid input, try again');
        setTimeout(() => sent_message2.delete(), 10000);
        return;
      }
      if (words[0].length <= 1) {
        const sent_message2 = await message.reply('Your word is too short');
        setTimeout(() => sent_message2.delete(), 10000);
        return;
      }
      const sent_message2 = await message.reply('Sending clue to the spies!');
      sent_message.delete();
      setTimeout(() => sent_message2.delete(), 10000);

      this.current_clue = {word: words[0], number: number};
      this.number_guesses = number + 1;
      this.edit_clue_message();


      clue_collector.stop();
    });
  }

  next_turn() {
    this.number_guesses = 0;
    this.current_clue = undefined;
    this.current_team = Codenames.team_symbols[1 - Codenames.team_symbols.indexOf(this.current_team)];
    this.request_clue();
  }

  start() {
    return new Promise(async (resolve, reject) => {
      let sent_language = await this.channel.send('Select your language:');
      for (let flag of Object.keys(Dict))
        await sent_language.react(flag);

      const collected = await sent_language.awaitReactions((reaction, user) => user.id != sent_language.author.id, { max: 1 });

      await this.assign_team();
      this.init_board(Dict[collected.first().emoji.name]);



      const sent_table = await this.channel.send(this.make_table(false));
      const revealed_table = this.make_table(true);
      const promises = this.players.slice(0,2).map(spymaster => spymaster.user.send(revealed_table));
      const spymaster_tables = await Promise.all(promises);

      const current_spymaster = this.spymasters[this.current_team];
      this.clue_message = await this.channel.send('Setting up the board...');

      this.request_clue();
      this.edit_clue_message();

      let collectors = [];
      for (let row = 0; row < 6; row++) {
        let sent = await this.channel.send(row == 0 ? '⠀\n\n> Choose a word here:' : (row == 5 ? 'Use this emote to end this turn:' : '⠀'));
        if (row == 5) {
          await sent.react('❌');
        } else {
          for (let col = 0; col < 5; col++)
            await sent.react(this.cards[row*5+col].letter);
        }
        const collector = sent.createReactionCollector((reaction, user) => user.id != sent.author.id);
        collectors.push(collector);

        collector.on('collect', (reaction, user) => {
          let is_allowed = false;
          for (let player of this.players) {
            if (player.user.id == user.id && player.role == this.current_team && this.number_guesses > 0)
              is_allowed = true;
          }

          if (is_allowed) {

            if (reaction.emoji.name == '❌') {
              this.next_turn();
              this.edit_clue_message();
              reaction.remove().then(() => sent.react('❌'));

            } else {

              const filtered_cards = this.cards.filter(card => card.letter == reaction.emoji.name);
              if (filtered_cards.length == 0) return;
              const card = filtered_cards[0];

              if (card.revealed == true) return;
              card.revealed = true;

              this.number_guesses -= 1;
              if (Codenames.team_symbols.includes(card.agent))
                this.number_agents[card.agent] -= 1;

              if (card.agent != this.current_team || this.number_guesses == 0)
                this.next_turn();
              this.edit_clue_message();


              // Find winner
              let winner = undefined;

              if (card.agent == '🕵️') {
                this.channel.send('https://tenor.com/view/gun-revolver-gif-3435633');
                winner = this.current_team;
              }

              for (let team of Codenames.team_symbols)
                if (this.number_agents[team] == 0)
                  winner = team;

              sent_table.edit(this.make_table(winner != undefined));
              spymaster_tables.map(table => table.edit(this.make_table(true)));

              if (winner != undefined) {
                this.channel.send(winner + ' Team wins');
                this.number_guesses = 0;
                for (let collector of collectors)
                  collector.stop();
                resolve();
              }
            }
          }
        });
      }
    });
  }
}
