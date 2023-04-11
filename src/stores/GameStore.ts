import { makeAutoObservable, runInAction } from "mobx";
import { Card, CardValue } from "../utils/cardUtils";
import { ActiveSpecialCard } from "../utils/gameUtils";
import { RootStore } from "./RootStore";
import { AIPlayer } from "./modules/AIPlayer";
import { CardManager } from "./modules/CardManager";
import { PlayerActions } from "./modules/PlayerActions";

export class GameStore {
	deck: Card[] = [];
	discardPile: Card[] = [];
	playerHand: Card[] = [];
	aiHands: Card[][] = [];
	currentPlayer = 0;
	activeSpecialCard: ActiveSpecialCard = ActiveSpecialCard.None;
	gameInProgress = false;
	wildDrawFourPlayed = false;
	direction = 1;
	aiPlayer: AIPlayer;
	cardManager: CardManager;
	playerActions: PlayerActions;

	constructor(store: RootStore) {
		makeAutoObservable(this);
		this.playCard = this.playCard.bind(this);
		this.handleDeckClick = this.handleDeckClick.bind(this);
		this.aiPlayer = new AIPlayer(this);
		this.cardManager = new CardManager(this);
		this.playerActions = new PlayerActions(this);
	}

	updateDeck(deck: Card[]) {
		this.deck = deck;
	}

	get validMoves(): number[] {
		return this.playerHand.reduce((validMoves, card, index) => {
			if (this.checkValidCard(card)) {
				validMoves.push(index);
			}
			return validMoves;
		}, [] as number[]);
        
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
		console.log("game finished");
		// TO-DO: add more logic/ cleanup here
	}

	startGame() {
		this.cardManager.shuffleAndDeal(3);
	}

	// action to draw multiple cards from the deck
	drawCards(playerIndex: number, count: number) {
		this.cardManager.drawCards(playerIndex, count);
	}
    
	async handleDeckClick() {
		await this.playerActions.handleDeckClick();
	}
    
	handleSpecialCard(card: Card) {
		switch (card.value) {
		case CardValue.WildDrawFour:
			this.activeSpecialCard = ActiveSpecialCard.DrawFour;
			break;
		case CardValue.DrawTwo:
			this.activeSpecialCard = ActiveSpecialCard.DrawTwo;
			break;
		case CardValue.Reverse:
			this.direction *= -1;
			if (this.aiHands.length === 1) { 
				this.activeSpecialCard = ActiveSpecialCard.Skip;
			} else {
				this.activeSpecialCard = ActiveSpecialCard.None;
			}
			break;
		case CardValue.Skip:
			this.activeSpecialCard = ActiveSpecialCard.Skip;
			break;
		default:
			this.activeSpecialCard = ActiveSpecialCard.None;
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
		this.currentPlayer = (this.currentPlayer + this.direction) % (this.aiHands.length + 1);
		if (this.currentPlayer < 0) {
			this.currentPlayer += this.aiHands.length + 1;
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
		this.activeSpecialCard = ActiveSpecialCard.None;
	}

	// action to check if a card is valid to play
	checkValidCard(card: Card): boolean {
		const topDiscard = this.discardPile[this.discardPile.length - 1];
    
		const isSameColor = card.color === topDiscard.color;
		const isSameValue = card.value === topDiscard.value;
		const isWild = card.value === CardValue.Wild;
		const isWildDrawFour = card.value === CardValue.WildDrawFour;
    
		const canPlayWild = isWild && this.activeSpecialCard !== ActiveSpecialCard.DrawTwo;
		const canPlayWildDrawFour = isWildDrawFour;
		const canPlayOnWild = topDiscard.value === CardValue.Wild;
		const canPlayOnWildDrawFour = topDiscard.value === CardValue.WildDrawFour && this.activeSpecialCard === ActiveSpecialCard.None;
    
		if (this.activeSpecialCard === ActiveSpecialCard.DrawFour) {
			return isWildDrawFour;
		}
    
		if (canPlayOnWild || canPlayWild || canPlayWildDrawFour || canPlayOnWildDrawFour) {
			return true;
		}
    
		if (this.activeSpecialCard === ActiveSpecialCard.None || topDiscard.value === CardValue.Skip) {
			return isSameColor || isSameValue;
		}
    
		// When there's an active special card, only a card with the same value can be played
		return isSameValue;
	}
}

