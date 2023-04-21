import React, { useState, useEffect } from 'react';
import CardComponent from './Card/Card';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { Card } from '../utils/cardUtils';

interface PlayerHandStyledProps {
  cardsCount: number
}

const PlayerHandContainer = styled.div<{isPlayerTurn: boolean, width: number}>`
  position: fixed;
  bottom: 20%;
  left: 45%;
  transform: translateX(-50%);
  width: ${({ width }) => `${width}vw`};
  display: flex;
  justify-content: center;
  filter: ${({ isPlayerTurn }) => isPlayerTurn && 'drop-shadow(white 0px 0px 10px)'};
`;

const PlayerHandStyled = styled.div<PlayerHandStyledProps>`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

interface PlayerHandProps {
  isPlayerTurn: boolean
  validMoves: number[]
  cards: Card[]
  currentPlayer: number, 
  cardsCount: number | null;
}

const PlayerHand: React.FC<PlayerHandProps> = observer(
	({ isPlayerTurn, validMoves, cards, currentPlayer, cardsCount }) => {
		const [containerWidth, setContainerWidth] = useState(50);

		useEffect(() => {
			if (cardsCount && cardsCount < 7) {
				setContainerWidth(50 - (7 - cardsCount) * 8.5);
			} else {
				setContainerWidth(50);
			}
		}, [cardsCount]);

		return (
			<PlayerHandContainer isPlayerTurn={isPlayerTurn} width={containerWidth}>
				<PlayerHandStyled cardsCount={cards.length}>
					{cards.map((card, index) => (
						<CardComponent
							key={card.id}
							card={card}
							cardIndex={index}
							highlight={isPlayerTurn && validMoves.includes(index)}
							mainPlayerHand={true}
							currentPlayer={currentPlayer}
						/>
					))}
				</PlayerHandStyled>
			</PlayerHandContainer>
		);
	},
);

export default PlayerHand;
