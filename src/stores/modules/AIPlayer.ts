import { GameStore } from "../GameStore";
import { runInAction } from "mobx";
import { ActiveSpecialCard } from "../../utils/gameUtils";

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
					// 1. Handle scenario where there is an active special card and AI's card is not special
					// 2. Handle scenario where there is an active special card and AI's card is of the same special value or DrawFour
					// 3. Handle scenario where there is an active special card AI does not have any cards to play, has to draw cards
					// 4. Handle scenario where there is no active cards and AI has a valid card
					// 5. Handle scenario where there is no active cards and AI does not have any valid cards
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
					if (this.game.activeSpecialCard === ActiveSpecialCard.Skip) {
						this.game.skipNextPlayer();
					} else {
						this.game.changeTurn();
					}
				});
			} else {
				runInAction(() => {
					// Check if the AI player needs to draw cards due to a DrawTwo or DrawFour card.
					if (this.game.activeSpecialCard === ActiveSpecialCard.DrawFour) {
						this.game.drawCards(aiPlayerIndex + 1, 4);
						this.game.activeSpecialCard = ActiveSpecialCard.None;
					} else if (this.game.activeSpecialCard === ActiveSpecialCard.DrawTwo) {
						this.game.drawCards(aiPlayerIndex + 1, 2);
						this.game.activeSpecialCard = ActiveSpecialCard.None;
					} else {
						this.game.drawCards(aiPlayerIndex + 1, 1);
					}
					this.game.changeTurn();
				});
			}

			setTimeout(() => resolve(), 1000);
		});
	}
}