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
} from './CardImages';

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

export interface Card {
  color: CardColor
  value: CardValue
  id: number
}

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

	console.log('Real active special card', activeSpecialCard);
  
	// Wild card can be played on any card if there are no active special cards
	if (isWild && noActiveDrawCards) {
		return true;
	}

	// You can play any card on the wild card
	if (topDiscard.value === CardValue.Wild) {
		return true;
	}

	if (isWildDrawFour && activeSpecialCard === CardValue.WildDrawFour) {
		return false;
	}

	// You can play wildDrawFour card on any card if there are no active special cards and only if you have no other options available
	if (isWildDrawFour && noActiveDrawCards) {
		const hasPlayableCard = playerHand.some(handCard => {
			return handCard.color === topDiscard.color || handCard.value === topDiscard.value || handCard.value === CardValue.Wild;
		});
		if (!hasPlayableCard) {
			return true;
		}
	}

	// If there is active DrawTwo card, you can only play DrawTwo on top
	if (activeSpecialCard === CardValue.DrawTwo) {
		return card.value === CardValue.DrawTwo;
	}

	// If there is Active Skip card, you cannot play any cards on top of it
	if (activeSpecialCard === CardValue.Skip) {
		return false;
	}

	// On wild draw four, you can play any card if WildDrawFour is not an active special card. Otherwise, you can play any card.
	if (topDiscard.value === CardValue.WildDrawFour && activeSpecialCard !== CardValue.WildDrawFour) {
		return true;
	}

	return isSameColor || isSameValue;
};

export const getRandomColor = (): CardColor => {
	const colors = [
		CardColor.Red,
		CardColor.Green,
		CardColor.Blue,
		CardColor.Yellow
	];
	return colors[Math.floor(Math.random() * colors.length)];
};
