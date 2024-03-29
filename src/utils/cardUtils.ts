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
	backside, 
	unoLogo
} from './cardImages';

export const allImages = [
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
	backside, 
	unoLogo
];

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

// Fisher-Yates shuffle algorithm
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
		case 'blue':
			return 'var(--blue)';
		case 'green':
			return 'var(--green)';
		case 'red':
			return 'var(--red)';
		case 'yellow':
			return 'var(--yellow)';
		default:
			return 'var(--white)';
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
		CardValue.WildDrawFour,
	].includes(card.value);
};

export enum CardType {
	MainPlayerHand,
	AiHand,
	Deck,
	Pile,
}

// wild card can be played on top of activeWildDrawFourcard


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
  
	const hasPlayableCard = playerHand.some(handCard => {
	  return handCard.color === topDiscard.color || handCard.value === topDiscard.value || handCard.value === CardValue.Wild;
	});
	if (isWildDrawFour && activeSpecialCard !== null) return false;
	if (isWildDrawFour && topDiscard.value === CardValue.Wild && playerHand.length !== 1) return false;
	if (isWild) {
		return activeSpecialCard === null;
	};
	if (topDiscard.value === CardValue.Wild) return true;
	if (isWildDrawFour && activeSpecialCard === null && !hasPlayableCard) return true;
	if (activeSpecialCard === CardValue.DrawTwo && card.value === CardValue.DrawTwo) return true;
	if (topDiscard.value === CardValue.WildDrawFour && activeSpecialCard !== CardValue.WildDrawFour && card.value !== CardValue.WildDrawFour) return true;
	if (activeSpecialCard !== CardValue.DrawTwo && (isSameColor || isSameValue)) return true;
  
	return false;
};
