import React from "react";
import CardComponent from "./CardComponent";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { v4 as uuidv4 } from "uuid";
import { Card } from "../utils/cardUtils";

const PlayerHandStyled = styled.div`
    position: absolute;
    bottom: 18%;
    left: 35%;
`;

interface PlayerHandProps {
	isPlayerTurn: boolean;
	validMoves: number[];
	playerHand: Card[];
}

const PlayerHand: React.FC<PlayerHandProps> = observer(({ isPlayerTurn, validMoves, playerHand }) => {
	return (
		<PlayerHandStyled>
			{playerHand.map((card, index) => (
				<CardComponent
					key={uuidv4()}
					card={card}
					cardIndex={index}
					highlight={isPlayerTurn && validMoves.includes(index)}
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