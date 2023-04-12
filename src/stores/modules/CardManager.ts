// CardManager.ts
import { GameStore } from "../GameStore";
import { Card, shuffle, CardValue, CardColor } from "../../utils/cardUtils";
import { cardDeck } from "../../utils/cardDeck";
import { runInAction } from "mobx";

export class CardManager {
	constructor(private game: GameStore) {}

	shuffleAndDeal(aiOpponents = 3): void {
		runInAction(() => {
			// Create a copy of the initial deck and shuffle it
			const initialDeck: Card[] = cardDeck.deck.map(
				(card) => new Card(card.color as CardColor, card.value as CardValue)
			);
			this.game.deck = shuffle(initialDeck);     
			// Initialize player and AI hands
			this.game.playerHand = [];
			this.game.aiHands = new Array(aiOpponents).fill(0).map(() => []);
          
			// deal cards to the player and AI opponents
			this.drawCards(0, 7);
			for (let i = 0; i < aiOpponents; i++) {
				this.drawCards(i + 1, 7);
			}
			// Draw the first card from the deck and place it in the discard pile
			let firstDiscardCard = this.drawCard();
			while (this.game.isSpecialCard(firstDiscardCard)) {
				this.game.deck.push(firstDiscardCard);
				this.game.deck = shuffle(this.game.deck);
				firstDiscardCard = this.drawCard();
			}
			this.game.discardPile = [firstDiscardCard];
			this.game.currentPlayer = 0;
			this.game.gameInProgress = true;

		});
	}

	drawCard(): Card {
		if (this.game.deck.length === 0) {
			throw new Error("The deck is empty");
		}
		return this.game.deck.pop() as Card;
	}

	drawCards(playerIndex: number, count: number) {
		const newCards = [];
    
		for (let i = 0; i < count; i++) {
			const newCard = this.drawCard();
			newCards.push(newCard);
		}
    
		if (playerIndex < 0 || playerIndex >= this.game.aiHands.length + 1) {
			console.error("Invalid playerIndex:", playerIndex);
			return;
		}
    
		if (playerIndex === 0) {
			this.game.playerHand.push(...newCards);
		} else {
			this.game.aiHands[playerIndex - 1].push(...newCards);
		}
	}
}