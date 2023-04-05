import { makeAutoObservable, runInAction } from "mobx";
import { Card, generateDeck, shuffle, CardValue } from "../utils/cardUtils";
import { ActiveSpecialCard } from "../utils/gameUtils";
import { RootStore } from "./RootStore";

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

	constructor(store: RootStore) {
		makeAutoObservable(this);
		this.playCard = this.playCard.bind(this);
		this.handleDeckClick = this.handleDeckClick.bind(this);
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

	// action to start a new game
	startGame(aiOpponents = 3) {
		runInAction(() => {
			this.deck = shuffle(generateDeck());
          
			// Initialize player and AI hands
			this.playerHand = [];
			this.aiHands = new Array(aiOpponents).fill(0).map(() => []);
          
			// deal cards to the player and AI opponents
			this.drawCards(0, 7);
			for (let i = 0; i < aiOpponents; i++) {
				this.drawCards(i + 1, 7);
			}
			// Draw the first card from the deck and place it in the discard pile
			let firstDiscardCard = this.drawCard();
			while (this.isSpecialCard(firstDiscardCard)) {
				this.deck.push(firstDiscardCard);
				this.deck = shuffle(this.deck);
				firstDiscardCard = this.drawCard();
			}
			this.discardPile = [firstDiscardCard];
			this.currentPlayer = 0;
			this.gameInProgress = true;
		});
	}

	// action to draw a single card from the deck
	drawCard(): Card {
		if (this.deck.length === 0) {
			throw new Error("The deck is empty");
		}
		return this.deck.pop() as Card;
	}

	// action to draw multiple cards from the deck
	drawCards(playerIndex: number, count: number) {
		const newCards = [];
    
		for (let i = 0; i < count; i++) {
			const newCard = this.drawCard();
			newCards.push(newCard);
		}
    
		if (playerIndex < 0 || playerIndex >= this.aiHands.length + 1) {
			console.error("Invalid playerIndex:", playerIndex);
			return;
		}
    
		if (playerIndex === 0) {
			this.playerHand.push(...newCards);
		} else {
			this.aiHands[playerIndex - 1].push(...newCards);
		}
	}
    
	async handleDeckClick() {
		if (!this.gameInProgress || this.currentPlayer !== 0) {
			return;
		}
    
		const currentPlayer = this.currentPlayer;
    
		// Handle special card cases
		if (this.activeSpecialCard === ActiveSpecialCard.DrawFour) {
			this.drawCards(currentPlayer, 4);
			this.activeSpecialCard = ActiveSpecialCard.None;
		} else if (this.activeSpecialCard === ActiveSpecialCard.DrawTwo) {
			this.drawCards(currentPlayer, 2);
			this.activeSpecialCard = ActiveSpecialCard.None;
		} else {
			this.drawCards(currentPlayer, 1);
		}
    
		this.changeTurn();
		this.checkGameOver();
    
		// If it's an AI player's turn after the player draws a card, automatically play a card or draw a card
		if (this.currentPlayer !== 0) {
			await this.playAllAiTurns();
		}
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
		if (!this.gameInProgress) {
			return; 
		}
		const card = this.playerHand[cardIndex];

		// When a user clicks on the card, check if the card is valid
		if (this.checkValidCard(card)) {
			runInAction(() => {
				// if yes, push this card to the top of the discard pile
				this.handleSpecialCard(card);
				this.discardPile.push(card);
    
				// Create a new array without the played card and assign it to playerHand
				this.playerHand = [
					...this.playerHand.slice(0, cardIndex),
					...this.playerHand.slice(cardIndex + 1),
				];

				if (this.activeSpecialCard === ActiveSpecialCard.Skip) {
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
					this.aiPlayCard(this.currentPlayer - 1);
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

	// Temp solution - AI bot will play the first valid card in his deck or draw a card if no cards are available

	async aiPlayCard(aiPlayerIndex: number): Promise<void> {
		if (!this.gameInProgress) {
			return; 
		}
		return new Promise((resolve) => {
			const aiHand = this.aiHands[aiPlayerIndex];

			// checking if AI can play any card, taking into account special cards
    
			const cardIndexToPlay = aiHand.findIndex((card) => this.checkValidCard(card));

    
			if (cardIndexToPlay >= 0) {
				// 1. Handle scenario where there is an active special card and AI's card is not special
				// 2. Handle scenario where there is an active special card and AI's card is of the same special value or DrawFour
				// 3. Handle scenario where there is an active special card AI does not have any cards to play, has to draw cards
				// 4. Handle scenario where there is no active cards and AI has a valid card
				// 5. Handle scenario where there is no active cards and AI does not have any valid cards
               
				runInAction(() => {
					// finding the card to play
					const cardToPlay = aiHand[cardIndexToPlay];
					// setting the right ActiveSpecial card if current card is a special card
					this.handleSpecialCard(cardToPlay);
					// adding the card to discard pile
					this.discardPile.push(cardToPlay);
					// amending the AI's hand
					aiHand.splice(cardIndexToPlay, 1);
					if (this.checkGameOver()) {
						return;
					}
					if (this.activeSpecialCard === ActiveSpecialCard.Skip) {
						this.skipNextPlayer();
					} else {
						this.changeTurn();
					}	
				});
			} else {
				// Check if the AI player needs to draw cards due to a DrawTwo or DrawFour card.
				if (this.activeSpecialCard === ActiveSpecialCard.DrawFour) {
					this.drawCards(aiPlayerIndex + 1, 4);
					this.activeSpecialCard = ActiveSpecialCard.None;
				} else if (this.activeSpecialCard === ActiveSpecialCard.DrawTwo) {
					this.drawCards(aiPlayerIndex + 1, 2);
					this.activeSpecialCard = ActiveSpecialCard.None;
				} else {
					this.drawCards(aiPlayerIndex + 1, 1);
				}
				this.changeTurn();
			}
    
			setTimeout(() => resolve(), 1000);
		});
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

