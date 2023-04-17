import { makeAutoObservable, runInAction, toJS } from 'mobx';
import {
	Card,
	CardValue,
	checkValidCard,
	isSpecialCard,
	ActiveSpecialCard,
} from '../utils/cardUtils';
import { RootStore } from './RootStore';
import { CardManager } from './modules/CardManager';
import { Player } from './modules/Player';

export class GameStore {
	currentPlayer = 0;
	activeSpecialCard: ActiveSpecialCard | null = null;
	gameInProgress = false;
	direction = 1;
	cardManager: CardManager;
	aiCardMoving = false;
	aiPlaying = false;
	aiPlayerCard: Card | null = null;


	players: Player[] = [];
	currentPlayerId = 0;

	constructor(store: RootStore) {
		makeAutoObservable(this);
		this.playCard = this.playCard.bind(this);
		this.handleDeckClick = this.handleDeckClick.bind(this);
		this.cardManager = new CardManager(); 
	}

	startGame(aiOpponents = 3) {
		console.log('startGame');
		runInAction(() => {
			this.cardManager.initialiseDeck();

			// Initialize main player
			const cards = this.cardManager.drawCards(7);
			const player = new Player(0, cards, true);
			this.players.push(player);

			// Initialize AI opponents
			for (let i = 0; i < aiOpponents; i++) {
				const aiCards = this.cardManager.drawCards(7);
				const aiPlayer = new Player(i + 1, aiCards, false);
				this.players.push(aiPlayer);
			}

			this.players.forEach((player) => {
				console.log(`Player ${player.id} isPlayer: ${player.isPlayer}`);
			});

			this.currentPlayer = 0;
			this.gameInProgress = true;
		});
	}

	get playerHand() {
		return this.players.find((player) => player.isPlayer)!.cards;
	}

	// this is not used anywhere

	updatePlayerCards(cards: Card[]) {
		const playerIndex = this.players.findIndex((player) => player.isPlayer);

		this.players[playerIndex].cards = cards;
	}

	drawCardsToPlayer(playerIndex: number) {
		console.log('%c⧭', 'color: #00bf00', playerIndex);
		let newCardsCount = 1;

		if (this.activeSpecialCard === CardValue.WildDrawFour) {
			newCardsCount = 4;
			this.activeSpecialCard = null;
		} else if (this.activeSpecialCard === CardValue.DrawTwo) {
			newCardsCount = 2;
			this.activeSpecialCard = null;
		}

		const newCards = this.cardManager.drawCards(newCardsCount);

		this.players[playerIndex].cards.push(...newCards);
	}

	checkGameOver(): boolean {
		const playerHand = this.playerHand;

		if (playerHand.length === 0) {
			this.endGame();
			return true;
		}
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].cards.length === 0) {
				this.endGame();
				return true;
			}
		}
		return false;
	}

	endGame() {
		this.gameInProgress = false;
		console.log('game finished');
		// TO-DO: add more logic/ cleanup here
	}

	resetGame() {
		// test if this is working properly
		this.gameInProgress = false;
		this.currentPlayer = 0;
		this.activeSpecialCard = null;
		this.direction = 1;
		this.cardManager.clearDeck();
		this.startGame();
	}

	get validMoves(): number[] {
		const playerHand = this.playerHand;
		return playerHand.reduce((validMoves, card, index) => {
			if (
				this.cardManager.lastDiscardPileCard &&
        checkValidCard(card, this.activeSpecialCard, this.cardManager.lastDiscardPileCard)
			) {
				validMoves.push(index);
			}
			return validMoves;
		}, [] as number[]);
	}

	async handleDeckClick() {
		if (!this.gameInProgress || this.currentPlayer !== 0) {
			return;
		}

		// Handle special card cases
		this.drawCardsToPlayer(this.currentPlayer);

		this.changeTurn();
		this.checkGameOver();

		// If it's an AI player's turn after the player draws a card, automatically play a card or draw a card
		if (this.currentPlayer !== 0) {
			await this.playAllAiTurns();
		}
	}

	handleSpecialCard(card: Card) {
		if (isSpecialCard(card)) {
			this.activeSpecialCard = card.value as ActiveSpecialCard;
		}

		if (card.value === CardValue.Reverse) {
			this.direction *= -1;
			this.activeSpecialCard = this.players.length === 1 ? CardValue.Skip : null;
		}
	}

	// action to play a card from the player's hand
	async playCard(cardIndex: number) {
		// await this.playerActions.playCard(cardIndex);

		const card =
      this.cardManager.lastDiscardPileCard &&
      this.players[this.currentPlayer].playCard(
      	this.activeSpecialCard,
      	this.cardManager.lastDiscardPileCard,
      	cardIndex,
      );

		if (card) {
			runInAction(() => {
				this.handleSpecialCard(card);
				this.cardManager.discardCardToPile(card);

				if (this.activeSpecialCard === CardValue.Skip) {
					this.skipNextPlayer();
				} else {
					this.changeTurn();
				}

				if (this.checkGameOver()) {
					return;
				}
			});

			// If it's an AI player's turn, automatically play a card
			if (this.currentPlayer !== 0) {
				await this.playAllAiTurns();
			}
		}
	}


	changeTurn() {
		runInAction(() => {
			this.currentPlayer = (this.currentPlayer + this.direction) % this.players.length;
			if (this.currentPlayer < 0) {
				this.currentPlayer += this.players.length;
			}
		});
	}

	async playAllAiTurns() {
		if (!this.gameInProgress) {
			return;
		}
		// If it's an AI player's turn, automatically play a card
		while (this.currentPlayer !== 0) {
			await new Promise((resolve) => {
				setTimeout(() => {
					const cardToPlay =
            this.cardManager.lastDiscardPileCard &&
            this.players[this.currentPlayer].playCard(
            	this.activeSpecialCard,
            	this.cardManager.lastDiscardPileCard,
            	0,
            );

					if (cardToPlay) {
						runInAction(() => {
			
							this.aiPlaying = true; // set aiPlaying to true when the AI player starts playing
							this.aiPlayerCard = cardToPlay;
							// setting the right ActiveSpecial card if current card is a special card
							this.handleSpecialCard(cardToPlay);
							// adding the card to discard pile
							this.cardManager.discardCardToPile(cardToPlay);
							// amending the AI's hand
							if (this.checkGameOver()) {
								return;
							}
							if (this.activeSpecialCard === CardValue.Skip) {
								this.skipNextPlayer();
							} else {
								this.changeTurn();
							}
							setTimeout(() => {
								runInAction(() => {
								  this.aiPlayerCard = null;
								  this.aiPlaying = false; // set aiPlaying to false when the AI player finishes playing
								});
							}, 0);
						});
					} else {
						runInAction(() => {
							// Check if the AI player needs to draw cards due to a DrawTwo or DrawFour card.
							if (this.cardManager.deck.length !== 0) {
								this.drawCardsToPlayer(this.currentPlayer);
							}

							this.changeTurn();
						});
					}
					resolve(null);
				}, 2000); //  delay of 2 seconds between AI players' turns
			});
		}
	}

	skipNextPlayer() {
		this.currentPlayer = (this.currentPlayer + 2 * this.direction) % (this.players.length + 1);
		if (this.currentPlayer < 0) {
			this.currentPlayer += this.players.length + 1;
		}
		this.activeSpecialCard = null;
	}
}

// import { makeAutoObservable } from 'mobx';
// import { Card, CardValue, ActiveSpecialCard, checkValidCard, isSpecialCard } from '../utils/cardUtils';
// import { RootStore } from './RootStore';
// import { AIPlayer } from './modules/AIPlayer';
// import { CardManager } from './modules/CardManager';
// import { PlayerActions } from './modules/PlayerActions';

// export class GameStore {
// 	deck: Card[] = [];
// 	discardPile: Card[] = [];
// 	playerHand: Card[] = [];
// 	aiHands: Card[][] = [];
// 	currentPlayer = 0;
// 	activeSpecialCard: ActiveSpecialCard | null = null;
// 	gameInProgress = false;
// 	wildDrawFourPlayed = false;
// 	direction = 1;
// 	aiPlayer: AIPlayer;
// 	cardManager: CardManager;
// 	playerActions: PlayerActions;
// 	aiCardMoving = false;
// 	aiPlayerIndex: number | null = null;
// 	aiPlayerCard: Card | null = null;
// 	aiPlaying = false;
// 	firstCard: Card | null = null;

// 	constructor(store: RootStore) {
// 		makeAutoObservable(this);
// 		this.playCard = this.playCard.bind(this);
// 		this.handleDeckClick = this.handleDeckClick.bind(this);
// 		this.aiPlayer = new AIPlayer(this);
// 		this.cardManager = new CardManager(this);
// 		this.playerActions = new PlayerActions(this);
// 	}

// 	setGameInProgress(value: boolean) {
// 		this.gameInProgress = value;
// 	}

// 	startGame() {
// 		this.cardManager.shuffleAndDeal(3);
// 	}

// 	checkGameOver(): boolean {
// 		if (this.playerHand.length === 0) {
// 			this.endGame();
// 			return true;
// 		}
// 		for (let i = 0; i < this.aiHands.length; i++) {
// 			if (this.aiHands[i].length === 0) {
// 				this.endGame();
// 				return true;
// 			}
// 		}
// 		return false;
// 	}

// 	endGame() {
// 		this.setGameInProgress(false);
// 		console.log('game finished');
// 		// TO-DO: add more logic/ cleanup here
// 	}

// 	resetGame() {
// 		// test if this is working properly
// 		this.setGameInProgress(false);
// 		this.deck = [];
// 		this.discardPile = [];
// 		this.currentPlayer = 0;
// 		this.activeSpecialCard = null;
// 		this.playerHand = [];
// 		this.aiHands = [];
// 		this.direction = 1;
// 		this.startGame();
// 	}

// 	// action to draw multiple cards from the deck
// 	drawCards(playerIndex: number, count: number) {
// 		this.cardManager.drawCards(playerIndex, count);
// 	}

// 	async handleDeckClick() {
// 		await this.playerActions.handleDeckClick();
// 	}

// 	get validMoves(): number[] {
// 		return this.playerHand.reduce((validMoves, card, index) => {
// 			if (checkValidCard(card, this.activeSpecialCard, )) {
// 				validMoves.push(index);
// 			}
// 			return validMoves;
// 		}, [] as number[]);

// 	}
// 	handleSpecialCard(card: Card) {
// 		switch (card.value) {
// 		case CardValue.WildDrawFour:
// 			this.activeSpecialCard = CardValue.WildDrawFour;
// 			break;
// 		case CardValue.DrawTwo:
// 			this.activeSpecialCard = CardValue.DrawTwo;
// 			break;
// 		case CardValue.Reverse:
// 			this.direction *= -1;
// 			if (this.aiHands.length === 1) {
// 				this.activeSpecialCard = CardValue.Skip;
// 			} else {
// 				this.activeSpecialCard = null;
// 			}
// 			break;
// 		case CardValue.Skip:
// 			this.activeSpecialCard = CardValue.Skip;
// 			break;
// 		default:
// 			this.activeSpecialCard = null;
// 			break;
// 		}
// 	}

// 	// action to play a card from the player's hand
// 	async playCard(cardIndex: number) {
// 		await this.playerActions.playCard(cardIndex);
// 	}

// 	changeTurn() {
// 		let nextPlayer = (this.currentPlayer + this.direction) % (this.aiHands.length + 1);
// 		if (nextPlayer < 0) {
// 			nextPlayer += this.aiHands.length + 1;
// 		}

// 		if (nextPlayer === 0) {
// 			// Add 2-second delay if the next player has an index of 0
// 			setTimeout(() => {
// 				this.currentPlayer = nextPlayer;
// 			}, 800);
// 		} else {
// 			// If the next player is not 0, update the currentPlayer without delay
// 			this.currentPlayer = nextPlayer;
// 		}
// 	}

// 	async playAllAiTurns() {
// 		if (!this.gameInProgress) {
// 			return;
// 		}
// 		// If it's an AI player's turn, automatically play a card
// 		while (this.currentPlayer !== 0 && this.gameInProgress) {
// 			await new Promise((resolve) => {
// 				setTimeout(() => {
// 					this.aiPlayer.aiPlayCard(this.currentPlayer - 1);
// 					resolve(null);
// 				}, 2000); //  delay of 2 seconds between AI players' turns
// 			});
// 		}
// 	}

// 	skipNextPlayer() {
// 		this.currentPlayer = (this.currentPlayer + 2 * this.direction) % (this.aiHands.length + 1);
// 		if (this.currentPlayer < 0) {
// 			this.currentPlayer += this.aiHands.length + 1;
// 		}
// 		this.activeSpecialCard = null;
// 	}
// }
