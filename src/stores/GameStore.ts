import { makeAutoObservable } from 'mobx';
import { Card, CardValue, ActiveSpecialCard } from '../utils/cardUtils';
import { RootStore } from './RootStore';
import { AIPlayer } from './modules/AIPlayer';
import { CardManager } from './modules/CardManager';
import { PlayerActions } from './modules/PlayerActions';

export class GameStore {
	deck: Card[] = [];
	discardPile: Card[] = [];
	playerHand: Card[] = [];
	aiHands: Card[][] = [];
	currentPlayer = 0;
	activeSpecialCard: ActiveSpecialCard | null = null;
	gameInProgress = false;
	wildDrawFourPlayed = false;
	direction = 1;
	aiPlayer: AIPlayer;
	cardManager: CardManager;
	playerActions: PlayerActions;
	aiCardMoving = false;
	aiPlayerIndex: number | null = null;
	aiPlayerCard: Card | null = null;	
	aiPlaying = false;
	firstCard: Card | null = null;

	constructor(store: RootStore) {
		makeAutoObservable(this);
		this.playCard = this.playCard.bind(this);
		this.handleDeckClick = this.handleDeckClick.bind(this);
		this.aiPlayer = new AIPlayer(this);
		this.cardManager = new CardManager(this);
		this.playerActions = new PlayerActions(this);
	}

	get aiCurrentPlayedCard(): Card | null {
		return this.aiPlayerCard;
	}

	startGame() {
		this.cardManager.shuffleAndDeal(3);
	}
	
	checkGameOver(): boolean {
		if (this.playerHand.length === 0) {
			this.endGame();
			return true;
		}    
		for (let i = 0; i < this.aiHands.length; i++) {
			if (this.aiHands[i].length === 0) {
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
		this.deck = [];
		this.discardPile = [];
		this.currentPlayer = 0;
		this.activeSpecialCard = null;
		this.playerHand = [];
		this.aiHands = [];
		this.direction = 1;
		this.startGame();
	}
	
	// action to draw multiple cards from the deck
	drawCards(playerIndex: number, count: number) {
		this.cardManager.drawCards(playerIndex, count);
	}
    
	async handleDeckClick() {
		await this.playerActions.handleDeckClick();
	}
    
	get validMoves(): number[] {
		return this.playerHand.reduce((validMoves, card, index) => {
			if (this.checkValidCard(card)) {
				validMoves.push(index);
			}
			return validMoves;
		}, [] as number[]);
		
	}
	handleSpecialCard(card: Card) {
		switch (card.value) {
		case CardValue.WildDrawFour:
			this.activeSpecialCard = CardValue.WildDrawFour;
			break;
		case CardValue.DrawTwo:
			this.activeSpecialCard = CardValue.DrawTwo;
			break;
		case CardValue.Reverse:
			this.direction *= -1;
			if (this.aiHands.length === 1) { 
				this.activeSpecialCard = CardValue.Skip;
			} else {
				this.activeSpecialCard = null;
			}
			break;
		case CardValue.Skip:
			this.activeSpecialCard = CardValue.Skip;
			break;
		default:
			this.activeSpecialCard = null;
			break;
		}
	}

	// action to play a card from the player's hand
	async playCard(cardIndex: number) {
		await this.playerActions.playCard(cardIndex);
	}

	isSpecialCard(card: Card): boolean {
		return (
			card.value === CardValue.Skip ||
          card.value === CardValue.DrawTwo ||
          card.value === CardValue.Reverse ||
          card.value === CardValue.Wild ||
          card.value === CardValue.WildDrawFour
		);
	}

	changeTurn() {
		let nextPlayer = (this.currentPlayer + this.direction) % (this.aiHands.length + 1);
		if (nextPlayer < 0) {
			nextPlayer += this.aiHands.length + 1;
		}
	
		if (nextPlayer === 0) {
			// Add 2-second delay if the next player has an index of 0
			setTimeout(() => {
				this.currentPlayer = nextPlayer;
			}, 800);
		} else {
			// If the next player is not 0, update the currentPlayer without delay
			this.currentPlayer = nextPlayer;
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
					this.aiPlayer.aiPlayCard(this.currentPlayer - 1);
					resolve(null);
				}, 2000); //  delay of 2 seconds between AI players' turns
			});
		}
	}

	skipNextPlayer() {
		this.currentPlayer = (this.currentPlayer + 2 * this.direction) % (this.aiHands.length + 1);
		if (this.currentPlayer < 0) {
			this.currentPlayer += this.aiHands.length + 1;
		}
		this.activeSpecialCard = null;
	}

	// action to check if a card is valid to play
	checkValidCard(card: Card): boolean {
		const topDiscard = this.discardPile[this.discardPile.length - 1];
    
		const isSameColor = card.color === topDiscard.color;
		const isSameValue = card.value === topDiscard.value;
		const isWild = card.value === CardValue.Wild;
		const isWildDrawFour = card.value === CardValue.WildDrawFour;
    
		const canPlayWild = isWild && this.activeSpecialCard !== CardValue.DrawTwo;
		const canPlayWildDrawFour = isWildDrawFour;
		const canPlayOnWild = topDiscard.value === CardValue.Wild;
		const canPlayOnWildDrawFour = topDiscard.value === CardValue.WildDrawFour && this.activeSpecialCard === null;
    
		if (this.activeSpecialCard === CardValue.WildDrawFour) {
			return isWildDrawFour;
		}
    
		if (canPlayOnWild || canPlayWild || canPlayWildDrawFour || canPlayOnWildDrawFour) {
			return true;
		}
    
		if (this.activeSpecialCard === null || topDiscard.value === CardValue.Skip) {
			return isSameColor || isSameValue;
		}
    
		// When there's an active special card, only a card with the same value can be played
		return isSameValue;
	}
}

