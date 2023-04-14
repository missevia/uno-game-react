import React from "react";
import CardComponent from "./CardComponent";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { Card } from "../utils/cardUtils";

interface PlayerHandStyledProps {
	cardsCount: number;
}

const PlayerHandContainer = styled.div`
  position: fixed;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 50vw;
  display: flex;
  justify-content: center;
`;

const PlayerHandStyled = styled.div<PlayerHandStyledProps>`
	display: flex;
  	justify-content: space-between;
  	width: 100%;
`;

interface PlayerHandProps {
	isPlayerTurn: boolean;
	validMoves: number[];
	cards: Card[];
}

const PlayerHand: React.FC<PlayerHandProps> = observer(({ isPlayerTurn, validMoves, cards }) => {
	const containerMaxWidth = 50; // in vw
	const cardWidth = 10; // in rem
	const cardsCount = cards.length;
	const cardOverlap = Math.max(
		0,
		Math.min(
			((cardWidth * cardsCount * window.innerWidth) / 100 - (containerMaxWidth * window.innerWidth) / 100) /
		(cardsCount - 1),
			(cardWidth * window.innerWidth) / 100 / 3
		)
	);
	return (
		<PlayerHandContainer>
			<PlayerHandStyled cardsCount={cards.length}>
				{cards.map((card, index) => (
					<CardComponent
						key={"player" + index}
						card={card}
						cardIndex={index}
						highlight={isPlayerTurn && validMoves.includes(index)}
						mainPlayerHand={true}
					/>
				))}
			</PlayerHandStyled>
		</PlayerHandContainer>
	);
});

export default PlayerHand;