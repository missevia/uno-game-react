import React from "react";
import CardComponent from "./CardComponent";
import styled from "styled-components";
import { useGame } from "../hooks/useGameStore";
import { observer } from "mobx-react-lite";
import { v4 as uuidv4 } from "uuid";

const PlayerHandStyled = styled.div`
    position: absolute;
    bottom: 18%;
    left: 35%;
`;

const PlayerHand: React.FC = observer(() => {
	const { game } = useGame();
	const isPlayerTurn = game.currentPlayer === 0;
	return (
		<PlayerHandStyled>
			{game.playerHand.map((card, index) => (
				<CardComponent
					key={uuidv4()}
					card={card}
					cardIndex={index}
					highlight={isPlayerTurn && game.validMoves.includes(index)}
					style={{
						marginLeft: (index * 80),
						marginTop: 0,
						zIndex: index,
					}}
				/>
			))}
		</PlayerHandStyled>
	);
});

export default PlayerHand;