import React from 'react';
import styled from 'styled-components';
import { Card } from '../utils/cardUtils';
import cardBack from '../assets/cards/backside.png';
import { observer } from 'mobx-react-lite';

interface DeckProps {
  deck: Card[];
  onClick: () => void;
}

const DeckStyled = styled.div`
  display: inline-block;
  margin-left: 10px;

  .card-back {
    width: 100px;
    height: 150px;
    background-image: url(${cardBack});
    background-size: cover;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const Deck: React.FC<DeckProps> = observer(({ deck, onClick }) => {
  return (
    <>
        <h1>Deck</h1>
        <DeckStyled>
        <div className="card-back" onClick={onClick}></div>
        </DeckStyled>
    </>
  );
});

export default Deck;