import React from "react";
import CardComponent from "./CardComponent";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { v4 as uuidv4 } from "uuid";
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
	playerHand: Card[];
}

const PlayerHand: React.FC<PlayerHandProps> = observer(({ isPlayerTurn, validMoves, playerHand }) => {
	const containerMaxWidth = 50; // in vw
	const cardWidth = 10; // in rem
	const cardsCount = playerHand.length;
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
			<PlayerHandStyled cardsCount={playerHand.length}>
				{playerHand.map((card, index) => (
					<CardComponent
						key={uuidv4()}
						card={card}
						cardIndex={index}
						highlight={isPlayerTurn && validMoves.includes(index)}
						mainPlayerHand={true}
						style={{
							marginLeft: -cardOverlap,
						}}
					/>
				))}
			</PlayerHandStyled>
		</PlayerHandContainer>
	);
});

export default PlayerHand;