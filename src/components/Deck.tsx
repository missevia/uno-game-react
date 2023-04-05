import React from "react";
import styled from "styled-components";
import { Card } from "../utils/cardUtils";
import cardBack from "../assets/cards/backside.png";
import { observer } from "mobx-react-lite";
import { useGame } from "../hooks/useGameStore";

interface DeckProps {
  deck: Card[];
  onClick: () => void;
}

interface DeckStyledProps {
  highlight: boolean;
}

const DeckStyled = styled.div<DeckStyledProps>`
  display: inline-block;
  margin-left: 150px;
  box-shadow: ${({ highlight }) =>
		highlight ? "0 0 5px 5px rgba(255, 255, 0, 0.5)" : "none"};
  

  .card-back {
    width: 100px;
    height: 150px;
    background-image: url(${cardBack});
    background-size: cover;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const Deck: React.FC<DeckProps> = observer(({ onClick }) => {
	const { game } = useGame();
	const isPlayerTurn = game.currentPlayer === 0;
	return (
		<>
			<DeckStyled highlight={isPlayerTurn}>
				<div className="card-back" onClick={onClick}></div>
			</DeckStyled>
		</>
	);
});

export default Deck;