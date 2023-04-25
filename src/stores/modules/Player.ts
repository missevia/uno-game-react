import { Card, checkValidCard, ActiveSpecialCard } from '../../utils/cardUtils';
import { makeAutoObservable, runInAction } from 'mobx';

export class Player {
	private id = 0;
	isPlayer = false;
	cards: Card[] = [];

	constructor(id: number, cards: Card[], isPlayer: boolean) {
		this.id = id;
		this.cards = cards;
		this.isPlayer = isPlayer;
		makeAutoObservable(this);
	}

	// Get an AI playable card, considering any active special card
	getAiPlayableCard(
		activeSpecialCard: ActiveSpecialCard | null,
		lastDiscardPileCard: Card,
	): Card | null {
		// checking if AI can play any card, taking into account special cards
		const cardIndexToPlay = this.cards.findIndex((card) =>
			checkValidCard(card, activeSpecialCard, lastDiscardPileCard, this.cards),
		);
		const cardToPlay = this.cards[cardIndexToPlay];
		return cardToPlay;
	}

	// Set new cards for the player
	setCards(newCards: Card[]) {
		this.cards = newCards;
	}

	// Play a card from the player's hand
	playCard(
		activeSpecialCard: ActiveSpecialCard | null,
		lastDiscardPileCard: Card,
		cardIndex: number,
	): Card | null {
		console.log(`Player ${this.id} cards before playing:`, JSON.stringify(this.cards));
		if (this.isPlayer) {
			const playerHand = this.cards;
			const card = playerHand[cardIndex];

			if (checkValidCard(card, activeSpecialCard, lastDiscardPileCard, this.cards)) {
				this.setCards([...playerHand.slice(0, cardIndex), ...playerHand.slice(cardIndex + 1)]);
			}
			console.log(`Player ${this.id} card to play:`, JSON.stringify(card));
			console.log(`Player ${this.id} cards after playing:`, JSON.stringify(this.cards));

			return card;
		} else {
			const aiHand = this.cards;

			const cardToPlay = this.getAiPlayableCard(activeSpecialCard, lastDiscardPileCard);

			if (cardToPlay) {
				runInAction(() => {
					this.cards = aiHand.filter((item) => item !== cardToPlay);
				});
			}
			console.log(`Player ${this.id} card to play:`, JSON.stringify(cardToPlay));
			console.log(`Player ${this.id} cards after playing:`, JSON.stringify(this.cards));
			return cardToPlay;
		}
	}
}
