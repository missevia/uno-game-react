import { makeAutoObservable, set, runInAction } from "mobx";
import { Card, generateDeck, shuffle, CardValue } from "../utils/cardUtils";
import { GameStatus } from "../utils/gameUtils";
import { RootStore } from "./RootStore";
import { toJS } from "mobx";

export class GameStore {
    deck: Card[] = [];
    discardPile: Card[] = [];
    playerHand: Card[] = [];
    aiHands: Card[][] = [];
    currentPlayer: number = 0;
    gameStatus: GameStatus = GameStatus.NotStarted;
    gameInProgress: boolean = false;
    fourCardsDrawnByAI: boolean = false;

    constructor(store: RootStore) {
        makeAutoObservable(this);
        this.playCard = this.playCard.bind(this);
    }

    get validMoves(): number[] {
        return this.playerHand.reduce((validMoves, card, index) => {
          if (this.fourCardsDrawnByAI) {
            console.log('4 cards drawn by AI')
            validMoves.push(index);
          } else if (this.checkValidCard(card)) {
            validMoves.push(index);
          }
          console.log('result', this.fourCardsDrawnByAI)
          return validMoves;
        }, [] as number[]);
      }

    // action to start a new game
    startGame(aiOpponents: number = 1) {
        runInAction(() => {
            this.deck = shuffle(generateDeck())
            // deal cards to the player and AI opponents
            this.playerHand = this.drawCards(7);
            this.aiHands = new Array(aiOpponents).fill(0).map(() => this.drawCards(7));
            // Draw the first card from the deck and place it in the discard pile
            this.discardPile = [this.drawCard()];
            this.currentPlayer = 0;
            this.gameInProgress = true;
        })
    }

    // action to draw a single card from the deck
    drawCard(): Card {
        if (this.deck.length === 0) {
            throw new Error("The deck is empty");
        }
        return this.deck.pop() as Card;
    }

    // action to draw multiple cards from the deck
    drawCards(count: number): Card[] {
        const cards: Card[] = [];
        for(let i = 0; i < count; i++) {
            cards.push(this.drawCard());
        }
        return cards;
    }

    addCardsToPlayerHand(cardArray: Card[]) {
        this.playerHand.push(...cardArray);
    }

    // action to play a card from the player's hand
    playCard(cardIndex: number) {
        console.log('Evia', this.playerHand)
        const card = this.playerHand[cardIndex];
        console.log('card', card) 

        // check if the card is valid to play and perform any necessary actions
        if (this.checkValidCard(card)) {
            runInAction(() => {
                this.discardPile.push(card);
                this.playerHand.splice(cardIndex, 1);
                this.changeTurn();
            })
             // If it's an AI player's turn, automatically play a card
            if (this.currentPlayer !== 0) {
                this.aiPlayCard(this.currentPlayer - 1);
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

    // action to change the turn to the next player
    changeTurn() {
        this.currentPlayer = (this.currentPlayer + 1) % (this.aiHands.length + 1);
    }

    skipNextPlayer() {
        this.currentPlayer = (this.currentPlayer + 2) % (this.aiHands.length + 1);
    }

    // Temp solution - AI bot will play the first valid card in his deck or draw a card if no cards are available

    aiPlayCard(aiPlayerIndex: number) {
        const aiHand = this.aiHands[aiPlayerIndex];
         // Check the top card of the discard pile
        const topDiscardCard = this.discardPile[this.discardPile.length - 1];

        if (topDiscardCard.value === CardValue.DrawTwo) {
            const newCards = this.drawCards(2);
            aiHand.push(...newCards);
            this.changeTurn();
            return; // Exit the function early after handling the drawTwo case
        } else if (topDiscardCard.value === CardValue.WildDrawFour) {
            const newCards = this.drawCards(4);
            aiHand.push(...newCards);
            this.fourCardsDrawnByAI = true;
            this.changeTurn();
            return; // Exit the function early after handling the drawFour case
        }
        // Find the first valid card in the AI's hand
        const cardIndexToPlay = aiHand.findIndex((card) => this.checkValidCard(card));
    
        if (cardIndexToPlay >= 0) {
            // If a valid card is found, play it
            runInAction(() => {
                const cardToPlay = aiHand[cardIndexToPlay];
                this.discardPile.push(cardToPlay);
                aiHand.splice(cardIndexToPlay, 1);
                this.changeTurn();
            })
        } else {
            // If no valid card is found, draw a card from the deck
            runInAction(() => {
                const newCard = this.drawCard();
                aiHand.push(newCard);
                this.changeTurn();
            })
          }
    }
    
    // action to check if a card is valid to play
    checkValidCard(card: Card): boolean {
        const topDiscard = this.discardPile[this.discardPile.length - 1];
        if (this.currentPlayer === 0 && this.fourCardsDrawnByAI) {
            this.fourCardsDrawnByAI = false;
            return true;
        }
        console.log('topDiscard', topDiscard)
        // Check if the card is a Wild card
        if (card.value === CardValue.Wild || card.value === CardValue.WildDrawFour) {
            return true;
        }
    
        // Check if the top card is an action card (reverse, skip, drawTwo, or drawFour)
        if (
            topDiscard.value === CardValue.Reverse ||
            topDiscard.value === CardValue.Skip ||
            topDiscard.value === CardValue.DrawTwo ||
            topDiscard.value === CardValue.WildDrawFour
        ) {
            // In this case, only allow playing a card with the same value
            return card.value === topDiscard.value;
        }
    
        // If the top card is not an action card, check if the card color or value matches the top card in the discard pile
        return card.color === topDiscard.color || card.value === topDiscard.value;
    }

    handleSpecialCards(card: Card) {
        switch(card.value) {
            case CardValue.Skip:
                this.gameStatus = GameStatus.Skipped;
                break;
            case CardValue.Reverse: 
                this.gameStatus = GameStatus.Reversed;
                break;
            case CardValue.DrawTwo:
                this.gameStatus = GameStatus.DrawingTwo;
                break;
            case CardValue.Wild: 
                this.gameStatus = GameStatus.ChoosingColor;
                break;
            case CardValue.WildDrawFour: 
                // change this
                this.gameStatus = GameStatus.DrawingFour;
                this.gameStatus = GameStatus.Skipped;
                break; 
        }
    }
    // 3. write checkGameOver function
    // 4. write calculateScore function
    // 5. write resetGame function

}
