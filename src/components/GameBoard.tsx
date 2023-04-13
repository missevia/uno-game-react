import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import PlayerHand from "./PlayerHand";
import AIHand from "./AIHand";
import DiscardPile from "./DiscardPile";
import Deck from "./Deck";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { GameStore } from "../stores/GameStore";
import DiscardPilePositionContext from "../contexts/DiscardPilePositionContext";

const GameBoardStyled = styled.div`
    height: 100vh;
    max-width: 100vw;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;

    .game-info {
        position: absolute; 
		top: 30%; 
        left: 40%;
    }

    .deck-discard {
        position: absolute;
        top: 40%;
        left: 40%;
        width: 200px;
    }
`;

interface GameBoardProps {
	game: GameStore;
}


const GameBoard:React.FC<GameBoardProps> = ({ game }) => {

	const [discardPilePosition, setDiscardPilePosition] = useState<DOMRect | null>(null);

	// TEMP console.log to check if any special card is now active (DrawTwo, DrawFour)
	useEffect(() => {
		if (game.activeSpecialCard) {
			console.log("ACTIVE SPECIAL CARD", game.activeSpecialCard);
		}

	}, [game.activeSpecialCard]);

	return (
		<DiscardPilePositionContext.Provider value={{ position: discardPilePosition, setPosition: setDiscardPilePosition }}>
			<GameBoardStyled>
				<div className="game-info">
					<h1>{`Current player: ${game.currentPlayer}`}</h1>
					<h1>{game.gameInProgress ? "Game in progress" : "Game over"}</h1>
				</div>
				<AIHand 
					key={uuidv4()} 
					aiHand={game.aiHands[0]} 
					horizontal={false} 
					aiCardMoving={game.aiCardMoving}
				/>
				<AIHand 
					key={uuidv4()} 
					aiHand={game.aiHands[1]} 
					horizontal={true}  
					style={{
						left: "50%"
					}}
					aiCardMoving={game.aiCardMoving}
				/>
				<AIHand 
					key={uuidv4()} 
					aiHand={game.aiHands[2]} 
					horizontal={false} 
					style={{
						right: "var(--cardWidthSmall)"
					}}
					aiCardMoving={game.aiCardMoving}
				/>
				<PlayerHand 
					isPlayerTurn={game.currentPlayer === 0} 
					validMoves={game.validMoves} 
					playerHand={game.playerHand}
				/>
				<div className='deck-discard'>
					<DiscardPile topCard={game.discardPile[game.discardPile.length - 1]} />
					<Deck deck={game.deck} onClick={game.handleDeckClick} currentPlayer={game.currentPlayer}/>
				</div>
			</GameBoardStyled>

		</DiscardPilePositionContext.Provider>
	);};

export default observer(GameBoard);