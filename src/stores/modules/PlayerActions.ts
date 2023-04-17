// import { GameStore } from '../GameStore';
// import { runInAction } from 'mobx';
// import { CardValue, checkValidCard } from '../../utils/cardUtils';

// export class PlayerActions {
// 	constructor(private game: GameStore) {}

// 	async playCard(cardIndex: number) {
// 		if (!this.game.gameInProgress) {
// 			return;
// 		}
// 		const card = this.game.playerHand[cardIndex];
// 		if (checkValidCard(card)) {
// 			runInAction(() => {
// 				this.game.handleSpecialCard(card);
// 				this.game.discardPile.push(card);
// 				this.game.playerHand = [
// 					...this.game.playerHand.slice(0, cardIndex),
// 					...this.game.playerHand.slice(cardIndex + 1),
// 				];

// 				if (this.game.activeSpecialCard === CardValue.Skip) {
// 					this.game.skipNextPlayer();
// 				} else {
// 					this.game.changeTurn();
// 				}

// 				if (this.game.checkGameOver()) {
// 					return;
// 				}
// 			});

// 			// If it's an AI player's turn, automatically play a card
// 			if (this.game.currentPlayer !== 0) {
// 				await this.game.playAllAiTurns();
// 			}
// 		}
// 	}

// 	async handleDeckClick() {
// 		if (!this.game.gameInProgress || this.game.currentPlayer !== 0) {
// 			return;
// 		}

// 		const currentPlayer = this.game.currentPlayer;

// 		// Handle special card cases
// 		if (this.game.activeSpecialCard === CardValue.WildDrawFour) {
// 			this.game.drawCards(currentPlayer, 4);
// 			this.game.activeSpecialCard = null;
// 		} else if (this.game.activeSpecialCard === CardValue.DrawTwo) {
// 			this.game.drawCards(currentPlayer, 2);
// 			this.game.activeSpecialCard = null;
// 		} else {
// 			this.game.drawCards(currentPlayer, 1);
// 		}

// 		this.game.changeTurn();
// 		this.game.checkGameOver();

// 		// If it's an AI player's turn after the player draws a card, automatically play a card or draw a card
// 		if (this.game.currentPlayer !== 0) {
// 			await this.game.playAllAiTurns();
// 		}
// 	}
// }
