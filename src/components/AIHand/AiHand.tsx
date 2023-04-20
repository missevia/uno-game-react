import React from 'react';
import { Card } from '../../utils/cardUtils';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import CardComponent from '../Card/Card';

const AIHandStyled = styled.div<{ horizontal: boolean }>`
  display: flex;
  justify-content: space-between;
  flex-direction: ${({ horizontal }) => (horizontal ? 'row' : 'column')};
  width: ${({ horizontal }) => (horizontal ? '100%' : 'auto')};
  height: ${({ horizontal }) => (horizontal ? 'auto' : '100%')};
`;

interface AIHandProps {
  aiHand: Card[]
  horizontal: boolean
  aiPlayerIndex: number
  playedCardIndex?: number | null
}

const AIHand: React.FC<AIHandProps> = observer(
	({ aiHand, horizontal, aiPlayerIndex, playedCardIndex }) => {
		return (
			<AIHandStyled horizontal={horizontal}>
				{aiHand.map((card, index) => (
					<CardComponent
						key={`${card.color}-${card.value}-${index}`}
						card={card}
						aiHand
						aiPlayerIndex={aiPlayerIndex}
						cardIndex={index}
						playedCardIndex={playedCardIndex}
					/>
				))}
			</AIHandStyled>
		);
	},
);

export default AIHand;