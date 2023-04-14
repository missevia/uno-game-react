import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import PlayerHand from "./PlayerHand";
import AIHand from "./AIHand";
import DiscardPile from "./DiscardPile";
import Deck from "./Deck";
import styled from "styled-components";
import { GameStore } from "../stores/GameStore";
import DiscardPilePositionContext from "../contexts/DiscardPilePositionContext";
import card from "../assets/cards/front-yellow.png";
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

import { BlurFilter } from "pixi.js";
import { Stage, Container, Sprite, Text } from "@pixi/react";

export const MyComponent = ({ cards }: { cards: any[]}) =>
{
	const blurFilter = useMemo(() => new BlurFilter(4), []);



	return (
		<Stage>
			

			<Container position={[150, 150]}>
				{
					cards.map((_, index) => {
						return (
							<Sprite
								key={index}
								image={card}
								x={400+index*10}
								y={270}
								anchor={{ x: 0.5, y: 0.5 }}
								width={50}
								height={100}
							/>
						);
					})
				}
				
			
			</Container>

			<Container position={[150, 350]}>
				<Sprite
					filters={[blurFilter]}
					image={card}
					x={400}
					y={270}
					anchor={{ x: 0.5, y: 0.5 }}
					width={50}
					height={100}
				/>
			</Container>
		</Stage>
	);
};


const GameBoard:React.FC<GameBoardProps> = ({ game }) => {
	console.log("%c⧭", "color: #e50000", game);

	const [discardPilePosition, setDiscardPilePosition] = useState<DOMRect | null>(null);

	// TEMP console.log to check if any special card is now active (DrawTwo, DrawFour)
	useEffect(() => {
		if (game.activeSpecialCard) {
			console.log("ACTIVE SPECIAL CARD", game.activeSpecialCard);
		}

	}, [game.activeSpecialCard]);

	const styleLeft = useMemo(() => ({
		left: "50%",
	}), []);

	const styleRight = useMemo(() => ({
		right: "var(--cardWidthSmall)"
	}), []);

	const context = useMemo(() => ({ discardPilePosition: discardPilePosition, setDiscardPilePosition: setDiscardPilePosition }), [discardPilePosition]);

	if (!game.gameInProgress || game.players.length === 0) return null;

	

	return (
		<DiscardPilePositionContext.Provider value={context}>
			{/* <MyComponent cards={game.players[0].cards} /> */}
			<GameBoardStyled>
				<div className="game-info">
					<h1>{`Current player: ${game.currentPlayer}`}</h1>
					<h1>{game.gameInProgress ? "Game in progress" : "Game over"}</h1>
				</div>
				<AIHand 
					aiHand={game.players[0].cards} 
					horizontal={false} 
					aiCardMoving={game.aiCardMoving}
				/>
				<AIHand 
					aiHand={game.players[1].cards} 
					horizontal={true}  
					style={styleLeft}
					aiCardMoving={game.aiCardMoving}
				/>
				<AIHand 
					aiHand={game.players[2].cards} 
					horizontal={false} 
					style={styleRight}
					aiCardMoving={game.aiCardMoving}
				/>
				<PlayerHand 
					isPlayerTurn={game.currentPlayer === 0} 
					validMoves={game.validMoves} 
					cards={game.playerHand}
				/>
				<div className='deck-discard'>
					<DiscardPile topCard={game.cardManager.lastDiscardPileCard} />
					<Deck deck={game.cardManager.deck} onClick={game.handleDeckClick} currentPlayer={game.currentPlayer}/>
				</div>
			</GameBoardStyled>

		</DiscardPilePositionContext.Provider>
	);};

export default observer(GameBoard);