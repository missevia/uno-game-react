import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import PlayerHand from "./PlayerHand";
import AIHand from "./AIHand";
import DiscardPile from "./DiscardPile";
import Deck from "./Deck";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { ActiveSpecialCard } from "../utils/gameUtils";
import { GameStore } from "../stores/GameStore";

const GameBoardStyled = styled.div`
    height: 100vh;
    max-width: 100vw;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;

    .game-info {
        position: absolute; top: 30%; 
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

	// TEMP console.log to check if any special card is now active (DrawTwo, DrawFour)

	useEffect(() => {
		if (game.activeSpecialCard) {
			console.log("ACTIVE SPECIAL CARD", ActiveSpecialCard[game.activeSpecialCard]);
		}

	}, [game.activeSpecialCard]);

	return (
		<GameBoardStyled>
			<div className="game-info">
				<h1>{`Current player: ${game.currentPlayer}`}</h1>
				<h1>{game.gameInProgress ? "Game in progress" : "Game over"}</h1>
			</div>
		
			<div id='ai-player-1'>
				<AIHand key={uuidv4()} aiHand={game.aiHands[0]} horizontal={false} right={false} />
			</div>
			<div id='ai-player-2'>
				<AIHand key={uuidv4()} aiHand={game.aiHands[1]} horizontal={true} right={false} />
			</div>
			<div id='ai-player-3'>
				<AIHand key={uuidv4()} aiHand={game.aiHands[2]} horizontal={false} right />
			</div>
			<div id='main-player'>
				<PlayerHand isPlayerTurn={game.currentPlayer === 0} validMoves={game.validMoves} playerHand={game.playerHand}/>
			</div>
			<div className='deck-discard'>
				<DiscardPile topCard={game.discardPile[game.discardPile.length - 1]} />
				<Deck deck={game.deck} onClick={game.handleDeckClick} currentPlayer={game.currentPlayer}/>
			</div>
		</GameBoardStyled>
	);};

export default observer(GameBoard);