import { cardDeck } from "./cardDeck";

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

// shuffling the cards using Fisher-Yates shuffle algorithm

export function shuffle(deck: Card[]): Card[] {
	const shuffledDeck = [...deck];
	for (let i = shuffledDeck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
	}
	return shuffledDeck;
}

export const getNumberColor = (color: CardColor): string => {
	switch (color) {
	case "blue":
		return "#3545F8";
	case "green":
		return "#1DE544";
	case "red":
		return "#F83434";
	case "yellow":
		return "#F9F716";
	default:
		return "white";
	}
};

