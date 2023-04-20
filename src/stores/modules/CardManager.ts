import { Card, shuffle, isSpecialCard } from '../../utils/cardUtils';
import { cardDeck } from '../../utils/cardDeck';
import { runInAction, makeAutoObservable } from 'mobx';

export class CardManager {
	discardPile: Card[] = [];
	deck: Card[] = [];
	lastDiscardPileCard?: Card;

	constructor() {
		makeAutoObservable(this);
		this.initialiseDeck();
		this.getFirstDiscardCard();
	}

	initialiseDeck() {
		this.deck = shuffle(cardDeck);
	}

	discardCardToPile(card: Card) {
		// Draw the first card from the deck and place it in the discard pile
		this.discardPile.push(card);
		this.lastDiscardPileCard = card;
	}

	// change to setFirstDiscardCard ?

	getFirstDiscardCard() {
		let firstDiscardCard = this.drawOneCard();

		while (isSpecialCard(firstDiscardCard)) {
			this.discardCardToPile(firstDiscardCard);
			this.deck = shuffle(this.deck);
			firstDiscardCard = this.drawOneCard();
		}

		this.lastDiscardPileCard = firstDiscardCard;
	}

	removeCardsFromDeck(cards: number) {
		this.deck.splice(0, cards);
	}

	drawOneCard(): Card {
		if (this.deck.length === 0) {
			throw new Error('The deck is empty');
		}
		return this.deck.pop() as Card;
	}

	drawCards(count: number): Card[] {
		const newCards: Card[] = [];

		for (let i = 0; i < count; i++) {
			if (this.deck.length === 0) {
				return newCards;
			}
			const newCard = this.drawOneCard();
			newCards.push(newCard);
		}
		return newCards;
	}

	clearDeck() {
		this.deck = [];
		this.discardPile = [];
	}
}
