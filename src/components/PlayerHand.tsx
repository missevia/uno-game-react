import React from "react";
import CardComponent from "./CardComponent";
import styled from "styled-components";
import { useGame } from "../hooks/useGameStore";
import { observer } from "mobx-react-lite";
import { v4 as uuidv4 } from "uuid";

const PlayerHandStyled = styled.div`
    .player-hand {
        display: flex;
    }
`;

const PlayerHand: React.FC = observer(() => {
	const { game } = useGame();
	const isPlayerTurn = game.currentPlayer === 0;
	return (
		<PlayerHandStyled>
			<h3>Your hand</h3>
			<div className="player-hand">
				{game.playerHand.map((card, index) => (
					<CardComponent
						key={uuidv4()}
						card={card}
						cardIndex={index}
						highlight={isPlayerTurn && game.validMoves.includes(index)}
					/>
				))}
			</div>
		</PlayerHandStyled>
	);
});

export default PlayerHand;