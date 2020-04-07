module.exports = class Deck {
  constructor() {
    this.cards = new Array();
  }

  empty() {
    this.cards = new Array();
  }

  size() {
    return this.cards.length
  }


  is_empty() {
    return (this.cards.length == 0);
  }

  add(card, n = 1) {
    for (let i = 0; i < n; i++) {
      if (Array.isArray(card))
        this.cards = this.cards.concat(card);
      else
        this.cards.push(card);
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(n = 1) {
    return this.cards.splice(0, n);
  }
}
