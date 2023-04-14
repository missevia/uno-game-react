import { Card, checkValidCard, ActiveSpecialCard } from "../../utils/cardUtils";

export class Player {
	id = 0;
	isPlayer = false;
	cards: Card[] = [];

	// player settings
	validMovesForPlayer = [];

	constructor(id: number, cards: Card[], isPlayer?: boolean) {
		this.id = id;
		this.cards = cards;
		this.isPlayer = !!isPlayer;
	}

	playCard(activeSpecialCard: ActiveSpecialCard | null, lastDiscardPileCard: Card, cardIndex: number): Card | undefined {
		if (this.isPlayer) {
			const playerHand = this.cards;
			const card = playerHand[cardIndex];
	
			if (checkValidCard(card, activeSpecialCard, lastDiscardPileCard)) {
				this.cards = [
					...playerHand.slice(0, cardIndex),
					...playerHand.slice(cardIndex + 1),
				];
			}

			return card;
		} else {
			const aiHand = this.cards;

			// checking if AI can play any card, taking into account special cards
			const cardIndexToPlay = aiHand.findIndex((card) => checkValidCard(card, activeSpecialCard, lastDiscardPileCard));
			const cardToPlay = aiHand[cardIndexToPlay];
	
			if (cardToPlay) {
				// amending the AI's hand
				aiHand.splice(cardIndexToPlay, 1);
			}
			
			return cardToPlay;
		}
		
	}
}