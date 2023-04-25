import React, { useState, useEffect } from 'react';
import { Card } from '../../utils/cardUtils';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import AIHand from './AiHand';

const AIHandContainerStyled = styled.div<{ horizontal: boolean, width: number, height: number }>`
  position: fixed;
  top: ${({ horizontal }) => (horizontal ? 'auto' : '50%')};
  width: ${({ horizontal, width }) => (horizontal ? `${width}vw` : 'auto')};
  height: ${({ horizontal, height }) => (horizontal ? 'auto' : `${height}vh`)};
  transform: ${({ horizontal }) => (horizontal ? 'translateX(-63%)' : 'translateY(-70%)')};
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  transition: width 0.3s ease, height 0.3s ease;
`;

interface AIHandContainerProps {
  aiHand: Card[]
  horizontal: boolean
  style?: React.CSSProperties
  aiPlayerIndex: number
  playedCardIndex?: number | null
  cardsCount: number | null;
}

const AIHandContainer: React.FC<AIHandContainerProps> = observer(
	({ aiHand, horizontal, style, aiPlayerIndex, cardsCount }) => {
		const width = 45;
		const height = 50;
		const [containerWidth, setContainerWidth] = useState(width);
		const [containerHeight, setContainerHeight] = useState(height);

		// Making card container change width and height depending on number of cards in player's hand
		useEffect(() => {
			if (cardsCount && cardsCount < 7) {
				if (horizontal) {
					setContainerWidth(width - ( 7 - cardsCount) * 8);
				} else {
					setContainerHeight(height - ( 7 - cardsCount) * 8);
				}	
			} else {
				if (horizontal) {
					setContainerWidth(width);
				} else {
					setContainerHeight(height);
				}	
			}
		}, [cardsCount]);


		return (
			<AIHandContainerStyled horizontal={horizontal} style={style} width={containerWidth} height={containerHeight}>
				<AIHand aiHand={aiHand} horizontal={horizontal} aiPlayerIndex={aiPlayerIndex}/>
			</AIHandContainerStyled>
		);
	},
);

export default AIHandContainer;
