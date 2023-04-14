import { makeAutoObservable, runInAction } from "mobx";
import { Card, CardValue, checkValidCard, isSpecialCard } from "../utils/cardUtils";
import { ActiveSpecialCard } from "../utils/cardUtils";
import { RootStore } from "./RootStore";
import { CardManager } from "./modules/CardManager";
import { Player } from "./modules/Player";

export class GameStore {
	currentPlayer = 0;
	activeSpecialCard: ActiveSpecialCard | null = null;
	gameInProgress = false;
	direction = 1;
	cardManager: CardManager;
	aiCardMoving = false;

	players: Player[]= [];
	currentPlayerId = 0;

	constructor(store: RootStore) {
		makeAutoObservable(this);
		this.playCard = this.playCard.bind(this);
		this.handleDeckClick = this.handleDeckClick.bind(this);
		this.cardManager = new CardManager();
	}

	startGame(aiOpponents = 3) {
		console.log("startGame");
		runInAction(() => {
			// this.cardManager.initializeDeck();

			// Initialize player and AI hands
			for (let i = 0; i < aiOpponents; i++) {
				const cards = this.cardManager.drawCards(7);
				const aiPlayer = new Player(i + 1, cards);
				this.players.push(aiPlayer);
			}

			const cards = this.cardManager.drawCards(7);
			const player = new Player(0, cards, true);
			this.players.push(player);
			
			this.currentPlayer = 0;
			this.gameInProgress = true;
		});
	}

	get playerHand() {
		return this.players.find(player => player.isPlayer)!.cards;
	}

	updatePlayerCards(cards: Card[]) {
		const playerIndex = this.players.findIndex(player => player.isPlayer);

		this.players[playerIndex].cards = cards;
	}

	drawCardsToPlayer(playerIndex: number) {
		console.log("%c⧭", "color: #00bf00", playerIndex);
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
		console.log("game finished");
		// TO-DO: add more logic/ cleanup here
	}

	resetGame() {
		// test if this is working properly
		this.gameInProgress = false;
		this.currentPlayer = 0;
		this.activeSpecialCard = null;
		this.direction = 1;
		this.startGame();
		this.cardManager.clearDeck();
	}
    
	get validMoves(): number[] {
		const playerHand = this.playerHand;
		return playerHand.reduce((validMoves, card, index) => {
			if (checkValidCard(card, this.activeSpecialCard, this.cardManager.lastDiscardPileCard)) {
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

		if(isSpecialCard(card)) {
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
		
		const card = this.players[this.currentPlayer].playCard(this.activeSpecialCard, this.cardManager.lastDiscardPileCard, cardIndex);
		
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
		this.currentPlayer = (this.currentPlayer + this.direction) % (this.players.length + 1);
		if (this.currentPlayer < 0) {
			this.currentPlayer += this.players.length + 1;
		}
	}

	async playAllAiTurns() {
		if (!this.gameInProgress) {
			return; 
		}
		// If it's an AI player's turn, automatically play a card
		while (this.currentPlayer !== 0) {
			await new Promise((resolve) => {
				setTimeout(() => {
					const cardToPlay = this.players[this.currentPlayer - 1].playCard(this.activeSpecialCard, this.cardManager.lastDiscardPileCard, 0);

					if (cardToPlay) {
						runInAction(() => {
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
						});
					} else {
						runInAction(() => {
							// Check if the AI player needs to draw cards due to a DrawTwo or DrawFour card.
							if (this.cardManager.deck.length !== 0) {
								this.drawCardsToPlayer(this.currentPlayer + 1);
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

