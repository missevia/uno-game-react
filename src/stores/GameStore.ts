import { makeAutoObservable, runInAction } from 'mobx';
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
	aiPlayerCardPlayed = false;
	aiPlayerCard: Card | null = null;
	drawTwoCount = 0;
	winner: number | null = null;
	drawingCards = false;
	cardsDrawn: Card[] | null = null;
	numberOfCardsToDraw: number | null = null;
	previousPlayer = 0;


	players: Player[] = [];
	currentPlayerId = 0;

	constructor(store: RootStore) {
		this.playCard = this.playCard.bind(this);
		this.resetGame = this.resetGame.bind(this);
		this.handleDeckClick = this.handleDeckClick.bind(this);
		this.cardManager = new CardManager(); 
		makeAutoObservable(this);
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

	// this is used in GameBoard to get up-to-date card counts to visualise the stacking of cards correctly
	get playerHandsLengths() {
		const lengths: (number | null)[] = [];
		const players = this.players;
		players.map(player => lengths.push(player.cards.length));
		return lengths;
	}

	get playerHand() {
		const mainPlayer = this.players.find((player) => player.isPlayer);
		return mainPlayer ? mainPlayer.cards : [];
	}

	// this is not used anywhere

	updatePlayerCards(cards: Card[], playerIndex: number) {
		this.players[playerIndex].cards.push(...cards);
	}

	setNumberOfCardsToDraw(value: number | null) {
		this.numberOfCardsToDraw = value;
	}

	drawCardsToPlayer(playerIndex: number) {
		console.log('%c⧭', 'color: #00bf00', playerIndex);
		this.drawingCards = true;
		let newCardsCount = 1;

		if (this.activeSpecialCard === CardValue.WildDrawFour) {
			newCardsCount = 4;
			this.activeSpecialCard = null;
		} else if (this.activeSpecialCard === CardValue.DrawTwo) {
			newCardsCount = 2 * this.drawTwoCount; // Multiply by drawTwoCount
			this.activeSpecialCard = null;
			this.drawTwoCount = 0; // Reset drawTwoCount after drawing cards
		}
		this.setNumberOfCardsToDraw(newCardsCount);

		setTimeout(() => {
			runInAction(() => {
				const newCards = this.cardManager.drawCards(newCardsCount);
				this.updatePlayerCards(newCards, playerIndex);
				this.setNumberOfCardsToDraw(null);
			});
		}, 1000);
	}

	checkGameOver(): boolean {
		const playerHand = this.players[0].cards;

		if (playerHand.length === 0) {
			this.endGame(0);
			return true;
		}
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].cards.length === 0) {
				this.endGame(i);
				return true;
			}
		}
		return false;
	}

	endGame(playerIndex: number) {
		runInAction(() => {
			this.winner = playerIndex;
			this.gameInProgress = false;
		});
		
		console.log('game finished');
		// TO-DO: add more logic/ cleanup here
	}

	resetGame() {
		runInAction(() => {
		  this.currentPlayer = 0;
		  this.activeSpecialCard = null;
		  this.direction = 1;
		  this.cardManager.clearDeck();
		  this.gameInProgress = true;
		  this.drawTwoCount = 0;
		  this.winner = null;
		  // Clear out existing players
		  this.players = [];
	  
		  // Start new game
		  this.startGame();
		});
	  }

	get validMoves(): number[] {
		const playerHand = this.playerHand;
		console.log('activeSpecialCard before calling checkValidCard', this.activeSpecialCard);
		return playerHand.reduce((validMoves, card, index) => {
			if (
				this.cardManager.lastDiscardPileCard &&
        checkValidCard(card, this.activeSpecialCard, this.cardManager.lastDiscardPileCard, this.players[0].cards)
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

		if (card.value === CardValue.DrawTwo) {
			this.drawTwoCount++;
		  } else {
			this.drawTwoCount = 0; // Reset the count if a non-DrawTwo card is played
		}
	}

	// action to play a card from the player's hand
	async playCard(cardIndex: number) {

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

				if (this.checkGameOver()) {
					return;
				  }

				if (this.activeSpecialCard === CardValue.Skip) {
					this.skipNextPlayer();
				} else {
					this.changeTurn();
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
			this.previousPlayer = this.currentPlayer;
			this.currentPlayer = (this.currentPlayer + this.direction) % this.players.length;
			if (this.currentPlayer < 0) {
				this.currentPlayer += this.players.length;
			}
		});
	}

	setAiPlayerCard(card: Card | null) {
		this.aiPlayerCard = card;
	}

	async playAllAiTurns() {
		if (!this.gameInProgress) {
			return;
		}
		// If it's an AI player's turn, automatically play a card
		while (this.currentPlayer !== 0 && this.gameInProgress) {
			await new Promise((resolve) => {
				setTimeout(() => {
					runInAction(() => {
						const playableCard = this.cardManager.lastDiscardPileCard &&
						this.players[this.currentPlayer].getAiPlayableCard(
							this.activeSpecialCard,
							this.cardManager.lastDiscardPileCard
						);
						if (playableCard) {
							this.setAiPlayerCard(playableCard);
						}	
					});

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
								if (this.checkGameOver()) {
									return;
								}
								// setting the right ActiveSpecial card if current card is a special card
								this.handleSpecialCard(cardToPlay);
								// adding the card to discard pile
								this.cardManager.discardCardToPile(cardToPlay);
	
								if (this.activeSpecialCard === CardValue.Skip) {
									this.skipNextPlayer();
								} else {
									this.changeTurn();
								}
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
						this.setAiPlayerCard(null);
			
					}, 500);
				}, 2000); //  delay of 2 seconds between AI players' turns
			});
		}
	}

	skipNextPlayer() {
		this.currentPlayer = (this.currentPlayer + 2 * this.direction) % (this.players.length);
		if (this.currentPlayer < 0) {
			this.currentPlayer += this.players.length;
		}
		this.activeSpecialCard = null;
	}
}
