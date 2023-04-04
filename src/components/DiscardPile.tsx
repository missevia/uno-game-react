import React from "react";
import CardComponent from "./CardComponent";
import { Card } from "../utils/cardUtils";
import styled from "styled-components";
import { observer } from "mobx-react-lite";

const DiscardPileStyled = styled.div`

`;

interface DiscardPileProps {
    topCard: Card;
}

const DiscardPile: React.FC<DiscardPileProps> = observer(({ topCard }) => (
	<div>
		<h2>Discard Pile</h2>
		{topCard ? (
			<CardComponent card={topCard} />
		) : (
			<p>No cards in the discard pile yet.</p>
		)}
	</div>
));

export default DiscardPile;