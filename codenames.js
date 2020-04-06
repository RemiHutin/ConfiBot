const assert = require('assert');
const Deck = require('./deck.js')


const WORDS = "ACCIDENT, ACHAT, ACNE, ACTION, ADOLESCENT, AFRIQUE, AIGUILLE, ALLUMER, ALPES, ALPHABET, ALTITUDE, AMERIQUE, AMI, AMOUR, AMPOULE, ANNIVERSAIRE, APPETIT, ARAIGNEE, ARBRE, ARC, ARC-EN-CIEL, ARGENT, ARME, ARMEE, ASCENSEUR, ASIE, ASSIS, ASTRONAUTE, ATCHOUM, ATHLETE, ATLANTIDE, AUBE, AUSTRALIE, AVEC, AVENTURE, AVION, AVOCAT, BAC, BAGUETTE, BAIN, BAISER, BALAI, BALLE, BALLON, BAMBOU, BANANE, BANNIR, BARBE, BARRIERE, BAS, BASKET, BATEAU, BATON, BATTERIE, BEBE, BEETHOVEN, BETE, BIBERON, BIERE, BLANC, BLE, BLEU, BOB, BOISSON, BOITE, BOMBE, BONBON, BONNET, BORD, BORDEAUX, BOTTE, BOUE, BOUGIE, BOULE, BOUTEILLE, BOUTON, BRANCHE, BRAS, BRAVO, BRETAGNE, BRISE, BROSSE, BRUIT, BRUME, BRUN, BÛCHE, BULLE, BUREAU, BUT, CABANE, CABINE, CACHER, CADEAU, CAFARD, CAFE, CAISSE, CALCULER, CALME, CAMERA, CAMION, CAMPING, CANADA, CANARD, CANETTE, CANINE, CAP, CAPITALISME, CAR, CAROTTE, CARRE, CARTE, CARTON, CASQUE, CASSER, CASSETTE, CAUCHEMAR, CAUSE, CEINTURE, CELLULE, CERCLE, CHAINE, CHAIR, CHAISE, CHAMP, CHAMPION, CHANT, CHAPEAU, CHARBON, CHARGE, CHASSE, CHAT, CHATEAU, CHAUD, CHAUSSURE, CHAUVE, CHEF, CHEMISE, CHENE, CHER, CHEVAL, CHEVALIER, CHEVEU, CHIEN, CHIFFRE, CHINE, CHOCOLAT, CHOMAGE, CIEL, CIL, CINEMA, CIRE, CIRQUE, CITRON, CLE, CLOU, CLOWN, COACH, COCCINELLE, CODE, CŒUR, COL, COLLE, COLLINE, COLONNE, CONE, CONFORT, CONTINU, CONTRE, CONVERSATION, COPAIN, COQ, COQUILLAGE, CORBEAU, CORDE, CORPS, COTE, COUDE, COULOIR, COUP, COUR, COURANT, COURRIER, COURS, COURSE, COURT, COUTEAU, COUVERT, COUVERTURE, COWBOY, CRAC, CRAYON, CREME, CRITIQUE, CROCHET, CROIX, CROÛTE, CUILLERE, CUIR, CUISINE, CULOTTE, CYCLE, DARD, DE, DEBOUT, DEFAUT, DEHORS, DEMOCRATIE, DENT, DENTISTE, DESSIN, DEVOIR, DIAMANT, DICTIONNAIRE, DIEU, DINOSAURE, DISCOURS, DISQUE, DIX, DOCTEUR, DOIGT, DOMINO, DORMIR, DROIT, EAU, ECHEC, ECHELLE, ECLAIR, ECOLE, ECRAN, ECRASER, ECRIT, EGLISE, EGOUT, ELECTRICITE, ELEPHANT, ELEVE, ELFE, EMPREINTE, ENCEINTE, EPICE, EPINE, ERREUR, ESPACE, ESPION, ESSENCE, ETAT, ETE, ETOILE, ETRANGER, EVENTAIL, EVOLUTION, EXPLOSION, EXTENSION, FACE, FAN, FARCE, FATIGUE, FAUTEUIL, FEMME, FENETRE, FER, FETE, FEU, FEUILLE, FIDELE, FIL, FILLE, FLAMME, FLECHE, FLEUR, FLEUVE, FOND, FOOTBALL, FORET, FORGER, FOUDRE, FOUET, FOUR, FOURMI, FROID, FROMAGE, FRONT, FRUIT, FUIR, FUTUR, GARÇON, GATEAU, GAUCHE, GAZ, GAZON, GEL, GENOU, GLACE, GOMME, GORGE, GOUTTE, GRAND, GRECE, GRENOUILLE, GRIPPE, GRIS, GROS, GROUPE, GUITARE, HASARD, HAUT, HELICOPTERE, HERBE, HEUREUX, HISTOIRE, HIVER, HOTEL, HUGO, HUILE, HUMIDE, HUMOUR, INDICE, INTERNET, INVITER, ITALIE, JACQUES, JAMBE, JAMBON, JARDIN, JAUNE, JEAN, JEANNE, JET, JEU, JOGGING, JOUR, JOURNAL, JUPITER, KILO, KIWI, LAINE, LAIT, LANGUE, LAPIN, LATIN, LAVER, LECTEUR, LEGER, LENT, LETTRE, LIEN, LIGNE, LINGE, LION, LIT, LIVRE, LOI, LONG, LOUIS, LOUP, LUMIERE, LUNDI, LUNE, LUNETTE, MACHINE, MACHO, MAIN, MAISON, MAITRESSE, MAL, MALADIE, MAMAN, MAMMOUTH, MANGER, MARAIS, MARC, MARCHE, MARIAGE, MARIE, MARIEE, MARQUE, MARSEILLE, MASSE, MER, MESSE, METRE, METRO, MIAOU, MICRO, MIEUX, MILLE, MINE, MIROIR, MODERNE, MOITIE, MONDE, MONSTRE, MONTAGNE, MONTRE, MORT, MOTEUR, MOTO, MOU, MOUCHE, MOULIN, MOUSTACHE, MOUTON, MUR, MUSCLE, MUSIQUE, MYSTERE, NAGE, NATURE, NEIGE, NEUTRE, NEW YORK, NEZ, NID, NINJA, NIVEAU, NOËL, NŒUD, NOIR, NOUS, NUAGE, NUIT, NUMERO, ŒIL, ŒUF, OISEAU, OLYMPIQUE, OMBRE, ONGLE, OR, ORAL, ORANGE, ORDINATEUR, ORDRE, ORDURE, OREILLE, ORGANE, ORGUEIL, OURS, OUTIL, OUVERT, OVALE, PAIN, PALAIS, PANNEAU, PANTALON, PANTIN, PAPA, PAPIER, PAPILLON, PARADIS, PARC, PARIS, PAROLE, PARTIE, PASSE, PATE, PATIN, PATTE, PAUL, PAYER, PECHE, PEINTURE, PENDULE, PENSER, PERSONNE, PETIT, PEUR, PHILOSOPHE, PHOTO, PHRASE, PIANO, PIECE, PIED, PIERRE, PILE, PILOTE, PINCE, PIOCHE, PION, PIRATE, PIRE, PISCINE, PLACE, PLAFOND, PLAGE, PLAIE, PLAN, PLANCHE, PLANETE, PLANTE, PLASTIQUE, PLAT, PLOMB, PLONGER, PLUIE, POCHE, POETE, POIDS, POING, POINT, POIVRE, POLICE, POLITIQUE, POLLEN, POLO, POMME, POMPE, PONT, POPULATION, PORT, PORTE, PORTEFEUILLE, POSITIF, POSTE, POUBELLE, POULE, POUPEE, POUSSER, POUSSIERE, POUVOIR, PREHISTOIRE, PREMIER, PRESENT, PRESSE, PRIER, PRINCESSE, PRISE, PRIVE, PROFESSEUR, PSYCHOLOGIE, PUBLIC, PULL, PUNK, PUZZLE, PYJAMA, QUATRE, QUINZE, RACE, RADIO, RAISIN, RAP, RAYE, RAYON, REFLECHIR, REINE, REPAS, REPTILE, REQUIN, REVE, RICHE, RIDEAU, RIEN, RIRE, ROBINET, ROCHE, ROI, ROND, ROSE, ROUE, ROUGE, ROUILLE, ROUX, RUSSIE, SABLE, SABRE, SAC, SAIN, SAISON, SALE, SALLE, SALUT, SAMU, SANDWICH, SANG, SAPIN, SATELLITE, SAUMON, SAUT, SAVOIR, SCHTROUMPF, SCIENCE, SCOUT, SEC, SEINE, SEL, SEPT, SERPENT, SERRER, SEXE, SHAMPOOING, SIECLE, SIEGE, SIESTE, SILHOUETTE, SIRENE, SKI, SOLEIL, SOMMEIL, SON, SONNER, SORCIERE, SOURD, SOURIS, SPORT, STAR, STATION, STYLO, SUR, SURFACE, SUSHI, SWING, TABLEAU, TACHE, TAILLE, TANTE, TAPIS, TARD, TAXI, TELEPHONE, TELEVISION, TEMPLE, TEMPS, TENNIS, TETE, THE, TIGRE, TINTIN, TISSU, TITRE, TOAST, TOILETTE, TOKYO, TOMBE, TON, TOP, TOUCHE, TOUJOURS, TOUR, TOURNOI, TOUT, TRACE, TRAIN, TRAINER, TRANSPORT, TRAVAIL, TRESOR, TRIANGLE, TRISTE, TRONE, TROUPEAU, TSAR, TUBE, TUER, TUPPERWARE, TUYAU, TWITTER, TYPE, UNIVERSITE, VACHE, VAGUE, VAISSELLE, VALEUR, VER, VERDICT, VERRE, VERS, VERT, VESTE, VIANDE, VIDE, VIE, VIEUX, VILLE, VIN, VINGT, VIOLON, VIPERE, VISION, VITE, VIVE, VŒU, VOILE, VOISIN, VOITURE, VOL, VOLUME, VOTE, VOULOIR, VOYAGE, ZEN, ZERO, ZODIAQUE, ZONE, ZOO".split(', ');


function mention_player(player) {
  return player.avatar.toString() + ' <@' + player.user.id + '>';
}

function other_team(team) {
  if (team == '🟥')
    return '🟦';
  if (team == '🟦')
    return '🟥';
  return undefined;
}

module.exports = class Codenames {
  static name = "Codenames";
  static emoji = "🕵️";
  static min_players = 2;
  static max_players = 8;

  static rules() {
    return "**TODO**";
  }

  constructor(players, channel) {
    this.players = players;
    this.channel = channel;
    this.current_clue_word = undefined;
    this.current_clue_number = undefined;
    this.number_guesses = undefined;
  }

  static letters = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

  make_table(cards, spymaster) {
    let count = {'🟥': '', '🟦': ''};
    let text = '';
    for (let row = 0; row < 5; row ++) {
      text += '\n';
      for (let col = 0; col < 5; col ++) {
        const card = cards[row*5+col];

        if (!card.revealed)
          count[card.agent] += card.agent;

        let symbol = card.revealed || spymaster ? card.agent : Codenames.letters[row*5+col];
        let modif = card.revealed && !spymaster ? '||' : '';
        text += symbol + modif + '**` ' + card.word + ' `**' + modif + symbol + '      ';
      }
      text += '\n';
    }
    return 'Agents left:\n' + count['🟥'] + '\n' + count['🟦'] + '\n' + text;
  }

  async choose_team() {

    let sent_team = await this.channel.send('Choose a team');
    await sent_team.react('🟥');
    await sent_team.react('🟦');

    const filter = (reaction, user) => (reaction.emoji.name === '🟥' || reaction.emoji.name === '🟦') && user.id != sent_team.author.id;
    let collected = await sent_team.awaitReactions(filter, { maxUsers: 1 });
    console.log(collected);


  }

  async assign_team() {
    let roles_deck = new Deck();
    roles_deck.add('🟥 spymaster', 1);
    roles_deck.add('🟦 spymaster', 1);
    roles_deck.add('🟥', Math.ceil((this.players.length - 2) / 2));
    roles_deck.add('🟦', Math.floor((this.players.length - 2) / 2));

    for (let player of this.players)
      player.role = roles_deck.draw();


    assert(roles_deck.is_empty(), 'Codenames.assign_team: ' + roles_deck.size() + ' role(s) left.');

    this.spymasters = new Map();

    let message = '';
    for (let team of ['🟥', '🟦']) {
      this.spymasters.set(team, this.players.filter(player => player.role == team + ' spymaster')[0]);
      message += 'Team ' + team + '\n';
      message += '> Spymaster: ' + mention_player(this.spymasters.get(team)) + '\n';
      message += '> Spies: ' + this.players.filter(player => player.role == team).map(player => mention_player(player)).join(', ') + '\n';
    }
    await this.channel.send(message);

  }




  init_board() {

    let words_deck = new Deck();
    words_deck.add(WORDS);
    words_deck.shuffle();

    const words = words_deck.draw(25);
    const length = Math.max(...words.map(word => word.length));

    this.current_team = ['🟥', '🟦'][Math.floor(Math.random()*2)];

    let agents_deck = new Deck();
    agents_deck.add('🟥', 8);
    agents_deck.add('🟦', 8);
    agents_deck.add(this.current_team, 1);
    agents_deck.add('🕵️', 1);
    agents_deck.add('⬜', 7);
    agents_deck.shuffle();


    this.cards = words.map(word => {
      const left = ' '.repeat(Math.trunc((length - word.length)/2));
      const right = ' '.repeat(length - word.length - left.length);
      return {word: left + word + right, agent: agents_deck.draw(), revealed: false}
    });
  }

  edit_clue_message() {
    const current_spymaster = this.spymasters.get(this.current_team);
    if (this.current_clue_word == undefined) {
      this.clue_message.edit('Waiting for a clue from ' + this.current_team + ' spymaster (' + mention_player(current_spymaster) + ')');
    } else {
      this.clue_message.edit(this.current_team + ' spymaster sent a clue!\n'
                      + 'The clue word is: **' + this.current_clue_word + '**\n'
                      + 'The clue number is: **' + this.current_clue_number + '**\n'
                      + 'Team ' + this.current_team + ', you have **' + this.number_guesses + '** guess(es) left.');
    }
  }

  async request_clue() {

    const current_spymaster = this.spymasters.get(this.current_team);
    await current_spymaster.user.send(current_spymaster.role + ', input your clue here. You need to input a word and a number, seperated with a space (example : *APPLE 2*)');
    const clue_collector = current_spymaster.user.dmChannel.createMessageCollector(m => m.author.id == current_spymaster.user.id);

    clue_collector.on('collect', message => {
      const str = message.content;
      const words = str.split(' ');
      if (words.length != 2) {
        message.reply('Invalid input, try again');
      } else {
        const number = parseInt(words[1]);
        if (isNaN(number)) {
          message.reply('Invalid input, try again');
        } else {
          message.reply('Sending clue to the spies!');
          this.current_clue_word = words[0];
          this.current_clue_number = number;
          this.number_guesses = number + 1;
          this.edit_clue_message();
          clue_collector.stop();
        }
      }
    });
  }

  async start() {

    await this.assign_team();
    this.init_board();



    const sent_table = await this.channel.send(this.make_table(this.cards, false));
    const revealed_table = this.make_table(this.cards, true);
    for (let player of this.players) {
      if (player.role == '🟥 spymaster' || player.role == '🟦 spymaster')
        await player.user.send(revealed_table);
    }

    const current_spymaster = this.spymasters.get(this.current_team);
    this.clue_message = await this.channel.send('Waiting for a clue from ' + this.current_team + ' spymaster (' + mention_player(current_spymaster) + ')');

    this.request_clue();

    for (let row = 0; row < 6; row++) {
      let sent = await this.channel.send(row == 0 ? '> Choose a word here:' : (row == 6 ? 'Une this emote to end this turn:' : '⠀'));
      if (row == 5) {
        await sent.react('❌');
      } else {
        for (let col = 0; col < 5; col++)
          await sent.react(Codenames.letters[row*5+col]);
      }
      const collector = sent.createReactionCollector((reaction, user) => user.id != sent.author.id);

      collector.on('collect', (reaction, user) => {
        let is_allowed = false;
        for (let player of this.players) {
          if (player.user.id == user.id && player.role == this.current_team && this.number_guesses > 0)
            is_allowed = true;
        }

        if (is_allowed) {

          if (reaction.emoji.name == '❌') {
            this.number_guesses = undefined;
            this.current_clue_word = undefined;
            this.current_clue_number = undefined;
            this.current_team = other_team(this.current_team);
            this.request_clue();

          } else {

            let index = Codenames.letters.indexOf(reaction.emoji.name);
            if (this.cards[index].revealed == true)
              return;
            this.cards[index].revealed = true;
            sent_table.edit(this.make_table(this.cards, false));

            if (this.cards[index].agent == '🕵️') {
              this.channel.send('https://tenor.com/view/gun-revolver-gif-3435633');
              this.channel.send(other_team(this.current_team) + ' team wins');
              sent_table.edit(this.make_table(this.cards, true));
              return;
            }
            else if (this.cards[index].agent == this.current_team) {
              this.number_guesses -= 1;
            } else {
              this.number_guesses = undefined;
              this.current_clue_word = undefined;
              this.current_clue_number = undefined;
              this.current_team = other_team(this.current_team);
              this.request_clue();
            }
            if (this.number_guesses == 0) {
              this.number_guesses = undefined;
              this.current_clue_word = undefined;
              this.current_clue_number = undefined;
              this.current_team = other_team(this.current_team);
              this.request_clue();
            }
            for (let team of ['🟥', '🟦']) {
              let has_won = true;
              for (let card of this.cards) {
                if (card.revealed == false && card.agent == team)
                  has_won = false;
              }
              if (has_won) {
                this.channel.send(team + ' team wins');
                sent_table.edit(this.make_table(this.cards, true));
              }
            }
          }


          this.edit_clue_message();
        }
      });
    }

  }
}
