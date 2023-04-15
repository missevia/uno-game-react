import React from 'react';
import styled from 'styled-components';
import { Card } from '../utils/cardUtils';
import cardBack from '../assets/cards/backside.png';
import { observer } from 'mobx-react-lite';

interface DeckProps {
  deck: Card[];
  onClick: () => void;
  currentPlayer: number;
}

interface DeckStyledProps {
  highlight: boolean;
}

const DeckStyled = styled.div<DeckStyledProps>`
  display: inline-block;
  margin-left: 15rem;
  box-shadow: ${({ highlight }) =>
		highlight ? '0 0 5px 5px rgba(255, 255, 0, 0.5)' : 'none'};
  

  .card-back {
    width: 10rem;
    height: 15rem;
    background-image: url(${cardBack});
    background-size: cover;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const Deck: React.FC<DeckProps> = observer(({ onClick, currentPlayer }) => {
	return (
		<DeckStyled highlight={currentPlayer === 0}>
			<div className="card-back" onClick={onClick}></div>
		</DeckStyled>
	);
});

export default Deck;