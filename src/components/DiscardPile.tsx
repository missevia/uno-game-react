import React from "react";
import CardComponent from "./CardComponent";
import { Card } from "../utils/cardUtils";
import { observer } from "mobx-react-lite";


interface DiscardPileProps {
    topCard: Card;
}

const DiscardPile: React.FC<DiscardPileProps> = observer(({ topCard }) => (
	<div>
		{topCard ? (
			<CardComponent card={topCard} />
		) : (
			<p>No cards in the discard pile yet.</p>
		)}
	</div>
));

export default DiscardPile;