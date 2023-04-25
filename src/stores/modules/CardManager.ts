import { Card, shuffle, isSpecialCard } from '../../utils/cardUtils';
import { cardDeck } from '../../utils/cardDeck';
import { makeAutoObservable } from 'mobx';

export class CardManager {
	discardPile: Card[] = [];
	deck: Card[] = [];
	lastDiscardPileCard?: Card;

	constructor() {
		makeAutoObservable(this);
		this.initialiseDeck();
		this.setFirstDiscardCard();
	}

	// Initialise the deck by shuffling the cardDeck
	initialiseDeck() {
		this.deck = shuffle(cardDeck);
	}
	
	// Add a card to the discard pile and set it as the last discard pile card
	discardCardToPile(card: Card) {
		this.discardPile.push(card);
		this.lastDiscardPileCard = card;
	}

	// Set the first card of the discard pile, ensuring it is not a special card
	setFirstDiscardCard() {
		let firstDiscardCard = this.drawOneCard();

		while (isSpecialCard(firstDiscardCard)) {
			this.discardCardToPile(firstDiscardCard);
			this.deck = shuffle(this.deck);
			firstDiscardCard = this.drawOneCard();
		}

		this.lastDiscardPileCard = firstDiscardCard;
	}

	// Remove a specified number of cards from the deck
	removeCardsFromDeck(cards: number) {
		this.deck.splice(0, cards);
	}

	// Draw one card from the deck
	drawOneCard(): Card {
		if (this.deck.length === 0) {
			throw new Error('The deck is empty');
		}
		return this.deck.pop() as Card;
	}

	// Draw a specified number of cards from the deck
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
