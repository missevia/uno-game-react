import {
	frontWild,
	frontBlue,
	frontGreen,
	frontRed,
	frontYellow,
	drawFour,
	drawFourBlank,
	drawTwoBlue,
	drawTwoGreen,
	drawTwoRed,
	drawTwoYellow,
	drawTwoBlank,
	reverseYellow,
	reverseBlue,
	reverseGreen,
	reverseRed,
	reverseBlank,
	skipBlue,
	skipGreen,
	skipRed,
	skipYellow,
	skipBlank,
	wild,
} from '../components/CardImages';

export enum CardColor {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
  Yellow = 'yellow',
  Wild = 'wild',
}

export enum CardValue {
  Zero = '0',
  One = '1',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Skip = 'skip',
  Reverse = 'reverse',
  DrawTwo = 'drawTwo',
  Wild = 'wild',
  WildDrawFour = 'drawFour',
}

export type ActiveSpecialCard =
  | CardValue.Skip
  | CardValue.Reverse
  | CardValue.DrawTwo
  | CardValue.WildDrawFour
  // | CardValue.Wild

export interface Card {
  color: CardColor
  value: CardValue
  id: number
}

// export class Card {
// 	color: CardColor;
// 	value: CardValue;

// 	constructor(color: CardColor, value: CardValue) {
// 		this.color = color;
// 		this.value = value;
// 	}
// }

// shuffling the cards using Fisher-Yates shuffle algorithm

export function shuffle(deck: Card[]): Card[] {
	const shuffledDeck = [...deck];
	for (let i = shuffledDeck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
	}
	return shuffledDeck;
}

export const getNumberColor = (color: CardColor): string => {
	switch (color) {
		case 'blue':
			return '#3545F8';
		case 'green':
			return '#1DE544';
		case 'red':
			return '#F83434';
		case 'yellow':
			return '#F9F716';
		default:
			return 'white';
	}
};

export const frontImages = {
	wild: frontWild,
	blue: frontBlue,
	green: frontGreen,
	red: frontRed,
	yellow: frontYellow,
};

export const specialImages = {
	drawFour: {
		colour: drawFour,
		blank: drawFourBlank,
	},
	drawTwo: {
		blue: drawTwoBlue,
		green: drawTwoGreen,
		red: drawTwoRed,
		yellow: drawTwoYellow,
		blank: drawTwoBlank,
	},
	reverse: {
		blue: reverseBlue,
		green: reverseGreen,
		red: reverseRed,
		yellow: reverseYellow,
		blank: reverseBlank,
	},
	skip: {
		blue: skipBlue,
		green: skipGreen,
		red: skipRed,
		yellow: skipYellow,
		blank: skipBlank,
	},
	wild: wild,
};

export const numberValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const isSpecialCard = (card: Card): boolean => {
	return [
		CardValue.Skip,
		CardValue.DrawTwo,
		CardValue.Reverse,
		// CardValue.Wild,
		CardValue.WildDrawFour,
	].includes(card.value);
};

export const checkValidCard = (
	card: Card,
	activeSpecialCard: ActiveSpecialCard | null,
	lastDiscardPileCard: Card,
	playerHand: Card[],
): boolean => {
	const topDiscard = lastDiscardPileCard;

	const isSameColor = card.color === topDiscard.color;
	const isSameValue = card.value === topDiscard.value;
	const isWild = card.value === CardValue.Wild;
	const isWildDrawFour = card.value === CardValue.WildDrawFour;
	const noActiveDrawCards = activeSpecialCard !== CardValue.DrawTwo && activeSpecialCard !== CardValue.WildDrawFour;

	const canPlayWild = isWild && noActiveDrawCards;
  
	if (noActiveDrawCards && topDiscard.value === CardValue.WildDrawFour) {
		return true;
	}
	const canPlayWildDrawFour = isWildDrawFour && noActiveDrawCards && playerHand.every(handCard => {
		if (handCard.value === CardValue.WildDrawFour) {
			return true;
		}
		return !(handCard.color === topDiscard.color || handCard.value === topDiscard.value);
	});

	const canPlayOnWild = topDiscard.value === CardValue.Wild;

	if (canPlayOnWild || canPlayWild) {
		return true;
	}

	if (isWildDrawFour && canPlayWildDrawFour) {
		return true;
	}

	if (activeSpecialCard === null || topDiscard.value === CardValue.Skip) {
		return isSameColor || isSameValue;
	}

	// When there's an active special card, only a card with the same value can be played
	return isSameValue;
};






// export const checkValidCard = (
// 	card: Card,
// 	activeSpecialCard: ActiveSpecialCard | null,
// 	lastDiscardPileCard: Card,
// 	playerHand: Card[],
// ): boolean => {
// 	const topDiscard = lastDiscardPileCard;

// 	const isSameColor = card.color === topDiscard.color;
// 	const isSameValue = card.value === topDiscard.value;
// 	const isWild = card.value === CardValue.Wild;
// 	const isWildDrawFour = card.value === CardValue.WildDrawFour;
// 	const noActiveDrawCards = activeSpecialCard !== CardValue.DrawTwo && activeSpecialCard !== CardValue.WildDrawFour;

// 	const canPlayWild = isWild && activeSpecialCard !== CardValue.DrawTwo;
// 	if (topDiscard.value === CardValue.WildDrawFour && noActiveDrawCards) {
// 		return true;
// 	}
// 	const canPlayWildDrawFour = isWildDrawFour && noActiveDrawCards && playerHand.every(handCard => {
// 		if (handCard.value === CardValue.WildDrawFour) {
// 			return true;
// 		}
// 		return !(handCard.color === topDiscard.color || handCard.value === topDiscard.value);
// 	});

// 	const canPlayOnWild = topDiscard.value === CardValue.Wild;

// 	if (canPlayOnWild || canPlayWild || canPlayWildDrawFour) {
// 		return true;
// 	}

// 	if (activeSpecialCard === null || topDiscard.value === CardValue.Skip) {
// 		return isSameColor || isSameValue;
// 	}

// 	// When there's an active special card, only a card with the same value can be played
// 	return isSameValue;
// };

export const getRandomColor = (): CardColor => {
	const colors = [
		CardColor.Red,
		CardColor.Green,
		CardColor.Blue,
		CardColor.Yellow
	];
	return colors[Math.floor(Math.random() * colors.length)];
};
