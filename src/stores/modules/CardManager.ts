import { Card, shuffle, CardValue, CardColor, isSpecialCard } from "../../utils/cardUtils";
import { cardDeck } from "../../utils/cardDeck";

export class CardManager {
	deck: Card[] = [];
	discardPile: Card[] = [];
	lastDiscardPileCard: Card;

	constructor() {
		this.initializeDeck();

		let firstDiscardCard = this.drawOneCard();

		while (isSpecialCard(firstDiscardCard)) {
			this.discardCardToPile(firstDiscardCard);
			this.deck = this.shuffleDeck(this.deck);
			firstDiscardCard = this.drawOneCard();
		}

		this.lastDiscardPileCard = firstDiscardCard;
	}

	initializeDeck() {
		// Create a copy of the initial deck and shuffle it
		const initialDeck: Card[] = cardDeck.deck.map(
			(card) => new Card(card.color as CardColor, card.value as CardValue)
		);
		this.deck = shuffle(initialDeck);   
	}
	discardCardToPile(card: Card) {
		// Draw the first card from the deck and place it in the discard pile
			
		this.discardPile.push(card);
		this.lastDiscardPileCard = card;

	}

	shuffleDeck(deck: Card[]) {
		return shuffle(deck);
	}

	drawOneCard(): Card {
		if (this.deck.length === 0) {
			throw new Error("The deck is empty");
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