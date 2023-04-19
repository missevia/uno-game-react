import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card } from '../utils/cardUtils';
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
`;

const Deck: React.FC<DeckProps> = observer(({ onClick, currentPlayer, deck }) => {
	const deckRef = useRef<HTMLDivElement | null>(null);
	const [deckPosition, setDeckPosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	useEffect(() => {
		if (deckRef.current) {
			const rect = deckRef.current.getBoundingClientRect();
			setDeckPosition({ x: rect.x, y: rect.y });
		}
	}, []);

	return (
		<DeckStyled highlight={currentPlayer === 0} as={motion.div} onClick={onClick}>
			{deck.map((card) => {
				// return <div className='card-back' onClick={onClick} key={card.id}></div>;
				return <CardComponent deck key={card.id} card={card} deckPosition={deckPosition} noShadow />;
			})}
		</DeckStyled>
	);
});

export default Deck;
