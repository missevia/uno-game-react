import React, { useState, useEffect } from 'react';
import { Card } from '../../utils/cardUtils';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import AIHand from './aiHand';

const AIHandContainerStyled = styled.div<{ horizontal: boolean, size: { height: number, width: number } }>`
  position: fixed;
  top: ${({ horizontal }) => (horizontal ? 'auto' : '50%')};
  width: ${({ horizontal, size }) => (horizontal ? `${size.width}vw` : 'auto')};
  height: ${({ horizontal, size }) => (horizontal ? 'auto' : `${size.height}vh`)};
  transform: ${({ horizontal }) => (horizontal ? 'translateX(-63%)' : 'translateY(-70%)')};
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  transition: width 0.3s ease, height 0.3s ease;
`;

const DEFAULT_CONTAINER_WIDTH = 45; // in vw
const DEFAULT_CONTAINER_HEIGHT = 50; // in vh

interface AIHandContainerProps {
  aiHand: Card[]
  horizontal: boolean
  style?: React.CSSProperties
  cardsCount: number | null;
}

const AIHandContainer: React.FC<AIHandContainerProps> = observer(
	({ aiHand, horizontal, style, cardsCount }) => {
		const [containerSize, setContainerSize] = useState({ width: DEFAULT_CONTAINER_WIDTH, height: DEFAULT_CONTAINER_HEIGHT });

		// resizing the horizontal and vertical AI hands depending on number of cards player currently has
		useEffect(() => {
			if (cardsCount && cardsCount < 7) {
			  if (horizontal) {
					setContainerSize({
						width: DEFAULT_CONTAINER_WIDTH - (7 - cardsCount) * 8,
						height: DEFAULT_CONTAINER_HEIGHT,
					});
			  } else {
					setContainerSize({
						width: DEFAULT_CONTAINER_WIDTH,
						height: DEFAULT_CONTAINER_HEIGHT - (7 - cardsCount) * 8,
					});
			  }
			} else {
			  setContainerSize({
					width: DEFAULT_CONTAINER_WIDTH,
					height: DEFAULT_CONTAINER_HEIGHT,
			  });
			}
		  }, [cardsCount]);

		return (
			<AIHandContainerStyled horizontal={horizontal} style={style} size={containerSize}>
				<AIHand aiHand={aiHand} horizontal={horizontal} />
			</AIHandContainerStyled>
		);
	},
);

export default AIHandContainer;
