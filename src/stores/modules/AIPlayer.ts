import { GameStore } from "../GameStore";
import { runInAction } from "mobx";
import { CardValue } from "../../utils/cardUtils";

export class AIPlayer {
	constructor(private game: GameStore) {}

	async aiPlayCard(aiPlayerIndex: number): Promise<void> {
		if (!this.game.gameInProgress) {
			return;
		}
		return new Promise((resolve) => {
			const aiHand = this.game.aiHands[aiPlayerIndex];

			// checking if AI can play any card, taking into account special cards
			const cardIndexToPlay = aiHand
				? aiHand.findIndex((card) => this.game.checkValidCard(card))
				: -1;

			if (cardIndexToPlay >= 0) {
				runInAction(() => {
					// finding the card to play
					const cardToPlay = aiHand[cardIndexToPlay];
					// setting the right ActiveSpecial card if current card is a special card
					this.game.handleSpecialCard(cardToPlay);
					// adding the card to discard pile
					this.game.discardPile.push(cardToPlay);
					// amending the AI's hand
					aiHand.splice(cardIndexToPlay, 1);
					if (this.game.checkGameOver()) {
						return;
					}
					if (this.game.activeSpecialCard === CardValue.Skip) {
						this.game.skipNextPlayer();
					} else {
						this.game.changeTurn();
					}
				});
			} else {
				runInAction(() => {
					// Check if the AI player needs to draw cards due to a DrawTwo or DrawFour card.
					if (this.game.deck.length === 0) {
						this.game.changeTurn();
					} else {
						if (this.game.activeSpecialCard === CardValue.WildDrawFour) {
							this.game.drawCards(aiPlayerIndex + 1, 4);
							this.game.activeSpecialCard = null;
						} else if (this.game.activeSpecialCard === CardValue.DrawTwo) {
							this.game.drawCards(aiPlayerIndex + 1, 2);
							this.game.activeSpecialCard = null;
						} else {
							this.game.drawCards(aiPlayerIndex + 1, 1);
						}
						this.game.changeTurn();
					}
				});
			}

			setTimeout(() => resolve(), 1000);
		});
	}
}