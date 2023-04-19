import React from 'react';
import styled from 'styled-components';
import { Card } from '../utils/cardUtils';
import cardBack from '../assets/cards/backside.png';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import CardComponent from './CardComponent';

interface DeckProps {
  deck: Card[]
  onClick: () => void
  currentPlayer: number
}

interface DeckStyledProps {
  highlight: boolean;
}

const DeckStyled = styled.div<DeckStyledProps>`
  display: inline-block;
  margin-left: 15rem;
  position: relative;
  box-shadow: ${({ highlight }) =>
		highlight
			? '0 0 5px 5px rgba(255, 255, 0, 0.75), 0 0 10px 2px rgba(255, 255, 0, 0.5)'
			: 'none'};

  /* .card-back {
    width: var(--cardWidth);
    height: var(--cardHeight);
    background-image: url(${cardBack});
    background-size: cover;
    border-radius: 4px;
    cursor: pointer;

    position: absolute; 
    top: 0; 
    left: 0; 
  } */
`;

const Deck: React.FC<DeckProps> = observer(({ onClick, currentPlayer, deck }) => {
	return (
		<DeckStyled highlight={currentPlayer === 0} as={motion.div} onClick={onClick}>
			{deck.map((card) => {
				// return <div className='card-back' onClick={onClick} key={card.id}></div>;
				return <CardComponent deck key={card.id} card={card}/>;
			})}
		</DeckStyled>
	);
});

export default Deck;
