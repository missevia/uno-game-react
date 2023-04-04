import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import PlayerHand from "./PlayerHand";
import AIHand from "./AIHand";
import DiscardPile from "./DiscardPile";
import { useGame } from "../hooks/useGameStore";
import Deck from "./Deck";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { CardValue } from "../utils/cardUtils";
import { toJS } from "mobx";
import { ActiveSpecialCard } from "../utils/gameUtils";

const GameBoardStyled = styled.div`
    display: flex;
    flex-direction: column;
`;
const GameBoard: React.FC = () => {
	const { game } = useGame();

	useEffect(() => {
		if (game.activeSpecialCard) {
			console.log("ACTIVE SPECIAL CARD", ActiveSpecialCard[game.activeSpecialCard]);
		}

	}, [game.activeSpecialCard]);

	// const handleDeckClick = () => {
	//     if (game.currentPlayer === 0) {
	//       const newCards = game.drawCards(game.nextPlayerDraws);
	//       game.addCardsToPlayerHand(newCards);
	//       game.nextPlayerDraws = 1;
      
	//       game.changeTurn();
	//       // Check if it's an AI player's turn after the player draws a card
	//       if (game.currentPlayer !== 0) {
	//         game.aiPlayCard(game.currentPlayer - 1);
	//       }
	//     }
	//   };

	return (
		<div>
			{game.gameInProgress ? (
				<h1>Game in progress</h1>
			) : (
				<h1>Game over</h1>
			)}
			<h1>{`Current player: ${game.currentPlayer}`}</h1>
			{/* <h1>{`Game status: ${toJS(game.gameStatus)}`}</h1> */}
			<PlayerHand />
        
			<div className="ai-hands">
				{game.aiHands.map((aiHand, handIndex) => (
					<AIHand key={uuidv4()} handIndex={handIndex} aiHand={[...aiHand]} />
				))}
			</div>
			<DiscardPile topCard={game.discardPile[game.discardPile.length - 1]} />
			<Deck deck={game.deck} onClick={game.handleDeckClick} />
		</div>
	);};

export default observer(GameBoard);