import React from 'react';
import styled from 'styled-components';
import { Card } from '../utils/cardUtils';
import cardBack from '../assets/cards/backside.png';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';

interface DeckProps {
  deck: Card[]
  onClick: () => void
  currentPlayer: number
}

interface DeckStyledProps {
  highlight: boolean
}

const DeckStyled = styled.div<DeckStyledProps>`
  display: inline-block;
  margin-left: 15rem;
  position: relative; // Add this line
  box-shadow: ${({ highlight }) =>
		highlight
			? '0 0 5px 5px rgba(255, 255, 0, 0.75), 0 0 10px 2px rgba(255, 255, 0, 0.5)'
			: 'none'};

  .card-back {
    width: 11rem;
    height: 16rem;
    background-image: url(${cardBack});
    background-size: cover;
    border-radius: 4px;
    cursor: pointer;

    position: absolute; // Add this line
    top: 0; // Add this line
    left: 0; // Add this line
  }
`;

const Deck: React.FC<DeckProps> = observer(({ onClick, currentPlayer, deck }) => {
	return (
		<DeckStyled highlight={currentPlayer === 0} as={motion.div}>
			{deck.map((card) => {
				return <div className='card-back' onClick={onClick} key={card.id}></div>;
			})}
		</DeckStyled>
	);
});

export default Deck;
