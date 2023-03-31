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

    constructor(store: RootStore) {
        makeAutoObservable(this);
        this.playCard = this.playCard.bind(this);
    }

    get validMoves(): number[] {
        return this.playerHand.reduce((validMoves, card, index) => {
          if (this.checkValidCard(card)) {
            validMoves.push(index);
          }
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

    addCardToPlayerHand(card: Card) {
        this.playerHand.push(card);
    }

    // action to play a card from the player's hand
    playCard(cardIndex: number) {
        const card = this.playerHand[cardIndex];
        console.log('card', card) 

        // check if the card is valid to play and perform any necessary actions
        if (this.checkValidCard(card)) {
            console.log('card is valid')
            this.discardPile.push(card);
            this.playerHand.splice(cardIndex, 1);
         

            // if (this.isSpecialCard(card)) {
            //     this.handleSpecialCards(card)
            // }

            this.changeTurn();

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
    
        // Find the first valid card in the AI's hand
        const cardIndexToPlay = aiHand.findIndex((card) => this.checkValidCard(card));
    
        if (cardIndexToPlay >= 0) {
            // If a valid card is found, play it
            runInAction(() => {
                const cardToPlay = aiHand[cardIndexToPlay];
                this.discardPile.push(cardToPlay);
                aiHand.splice(cardIndexToPlay, 1);
                // set(this.aiHands, aiPlayerIndex, aiHand); // Update the AI's hand using MobX's set method
                if (this.isSpecialCard(cardToPlay)) {
                    this.handleSpecialCards(cardToPlay)
                }
                this.changeTurn();
            })
        } else {
            // If no valid card is found, draw a card from the deck
            runInAction(() => {
                const newCard = this.drawCard();
                aiHand.push(newCard);
                this.changeTurn();
            })
          
            // set(this.aiHands, aiPlayerIndex, aiHand); // Update the AI's hand
          }
       
    }
    
    // action to check if a card is valid to play
    checkValidCard(card: Card): boolean {
        const topDiscard = this.discardPile[this.discardPile.length - 1];
        console.log('topDiscard', topDiscard)

        // Check if the card color or value matches the top card in the discard pile, or if the card is a Wild card
        return card.color === topDiscard.color || card.value === topDiscard.value || card.value === CardValue.Wild || card.value === CardValue.WildDrawFour;
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
