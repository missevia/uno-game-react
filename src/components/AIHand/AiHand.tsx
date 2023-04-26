import React from 'react';
import { Card, CardType } from '../../utils/cardUtils';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import CardComponent from '../card/cardComponent';

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
}

const AIHand: React.FC<AIHandProps> = observer(
	({ aiHand, horizontal }) => {
		return (
			<AIHandStyled horizontal={horizontal}>
				{aiHand.map((card, index) => (
					<CardComponent
						key={card.id}
						card={card}
						cardType={CardType.AiHand}
						cardIndex={index}
					/>
				))}
			</AIHandStyled>
		);
	},
);

export default AIHand;