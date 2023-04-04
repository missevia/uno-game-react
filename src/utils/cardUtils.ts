import cardDeck from "../utils/cardDeck.json";

export enum CardColor {
  Red = "red",
  Green = "green",
  Blue = "blue",
  Yellow = "yellow",
  Wild = "wild",
}

export enum CardValue {
  Zero = "0",
  One = "1",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Skip = "skip",
  Reverse = "reverse",
  DrawTwo = "drawTwo",
  Wild = "wild",
  WildDrawFour = "drawFour",
}

export class Card {
	color: CardColor;
	value: CardValue;

	constructor(color: CardColor, value: CardValue) {
		this.color = color;
		this.value = value;
	}
}

export function generateDeck(): Card[] {
	const deck: Card[] = cardDeck.deck.map(
		(card) => new Card(card.color as CardColor, card.value as CardValue)
	);
	return deck;
}
// shuffling the cards using Fisher-Yates shuffle algorithm

export function shuffle(deck: Card[]): Card[] {
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
}

