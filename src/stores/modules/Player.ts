import { Card, checkValidCard, ActiveSpecialCard } from '../../utils/cardUtils';
import { makeAutoObservable, reaction, runInAction } from 'mobx';

export class Player {
	id = 0;
	isPlayer = false;
	cards: Card[] = [];
	validMovesForPlayer = [];

	constructor(id: number, cards: Card[], isPlayer: boolean) {
		this.id = id;
		this.cards = cards;
		this.isPlayer = isPlayer;
		makeAutoObservable(this);
	}

	playCard(
		activeSpecialCard: ActiveSpecialCard | null,
		lastDiscardPileCard: Card,
		cardIndex: number,
	): Card | undefined {
		console.log(`Player ${this.id} cards before playing:`, JSON.stringify(this.cards));
		if (this.isPlayer) {
			const playerHand = this.cards;
			const card = playerHand[cardIndex];

			if (checkValidCard(card, activeSpecialCard, lastDiscardPileCard, this.cards)) {
				// add this to separate function?
				this.cards = [...playerHand.slice(0, cardIndex), ...playerHand.slice(cardIndex + 1)];
			}
			console.log(`Player ${this.id} card to play:`, JSON.stringify(card));
			console.log(`Player ${this.id} cards after playing:`, JSON.stringify(this.cards));

			return card;
		} else {
			const aiHand = this.cards;

			// checking if AI can play any card, taking into account special cards
			const cardIndexToPlay = aiHand.findIndex((card) =>
				checkValidCard(card, activeSpecialCard, lastDiscardPileCard, this.cards),
			);
			const cardToPlay = aiHand[cardIndexToPlay];

			if (cardToPlay) {
				// amending the AI's hand
				aiHand.splice(cardIndexToPlay, 1);
				runInAction(() => {
					this.cards = aiHand;
				});
			}
			console.log(`Player ${this.id} card to play:`, JSON.stringify(cardToPlay));
			console.log(`Player ${this.id} cards after playing:`, JSON.stringify(this.cards));
			return cardToPlay;
		}
	}
}
