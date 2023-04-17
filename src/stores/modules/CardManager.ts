// CardManager.ts
import { GameStore } from '../GameStore';
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

	// drawCards(playerIndex: number, count: number) {
	// 	const newCards = [];

	// 	for (let i = 0; i < count; i++) {
	// 		const newCard = this.drawOneCard();
	// 		newCards.push(newCard);
	// 	}

	// 	if (playerIndex < 0 || playerIndex >= this.game.aiHands.length + 1) {
	// 		console.error('Invalid playerIndex:', playerIndex);
	// 		return;
	// 	}

	// 	if (playerIndex === 0) {
	// 		this.game.playerHand.push(...newCards);
	// 	} else {
	// 		this.game.aiHands[playerIndex - 1].push(...newCards);
	// 	}
	// }

	clearDeck() {
		this.deck = [];
		this.discardPile = [];
	}

	// shuffleAndDeal(aiOpponents = 3): void {
	// 	runInAction(() => {
	// 		// Create a copy of the initial deck and shuffle it
	// 		this.game.deck = shuffle(cardDeck);
	// 		// Initialize player and AI hands
	// 		this.game.playerHand = [];
	// 		this.game.aiHands = new Array(aiOpponents).fill(0).map(() => []);

	// 		// deal cards to the player and AI opponents
	// 		this.drawCards(0, 7);
	// 		for (let i = 0; i < aiOpponents; i++) {
	// 			this.drawCards(i + 1, 7);
	// 		}
	// 		// Draw the first card from the deck and place it in the discard pile
	// 		let firstDiscardCard = this.drawCard();
	// 		while (isSpecialCard(firstDiscardCard)) {
	// 			this.game.deck.push(firstDiscardCard);
	// 			this.game.deck = shuffle(this.game.deck);
	// 			firstDiscardCard = this.drawCard();
	// 		}
	// 		this.game.discardPile = [firstDiscardCard];
	// 		this.game.firstCard = firstDiscardCard;
	// 		this.game.currentPlayer = 0;
	// 		this.game.setGameInProgress(true);
	// 	});
	// }
}
