import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import PlayerHand from './PlayerHand';
import AIHandContainer from './AIHand/AiHandContainer';
import DiscardPile from './DiscardPile';
import Deck from './Deck';
import styled from 'styled-components';
import { GameStore } from '../stores/GameStore';
import DiscardPilePositionContext from '../contexts/DiscardPilePositionContext';
import ModalRender from './Modal/ModalRender';


const GameBoardStyled = styled.div`
  height: 100vh;
  max-width: 100vw;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  background: linear-gradient(to top, #09203f 0%, #537895 100%);
  z-index: 0;

  .game-info {
    position: absolute;
    top: 30%;
    left: 40%;
  }
`;

const DiscardPileContainer = styled.div`
	position: absolute;
    top: 40%;
    left: 40%;
`;
interface GameBoardProps {
  game: GameStore, 
  initialized: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ game, initialized }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const navigate = useNavigate();
	const [discardPilePosition, setDiscardPilePosition] = useState<DOMRect | null>(null);
	const context = useMemo(() => (
		{ discardPilePosition: discardPilePosition, setDiscardPilePosition: setDiscardPilePosition }), 
		 [discardPilePosition]
	);

	const leftHandStyle = useMemo(() => ({
		left: '50%',
	  }), []);
	  
	const rightHandStyle = useMemo(() => ({
		right: 'var(--cardWidth)',
	}), []);

	const close = () => setModalOpen(false);
	const open = () => setModalOpen(true);
	
	useEffect(() => {
		if (!game.gameInProgress && game.winner !== null) {
			open();
		}
	}, [game.gameInProgress, game.winner]);

	const startNewGame = () => {
		close();
		game.resetGame();
		navigate('/game');
	};

	const goToMainMenu = () => {
		close();
		game.resetGame();
		navigate('/main-menu');
	};



	if (game.players.length === 0 && !initialized) {
		return null;
	}

	return (
		<DiscardPilePositionContext.Provider
			value={{ position: context.discardPilePosition, setPosition: context.setDiscardPilePosition }}
		>
			<GameBoardStyled>
				{/* Uncomment the below for debugging purposes */}
				{/* <div className='game-info'>
					<h1>{`Current player: ${game.currentPlayer === 0 ? 'You' : `Bot number ${game.currentPlayer}`}`}</h1>
				</div> */}
				<AIHandContainer
					aiHand={game.players[1].cards}
					horizontal={false}
					cardsCount={game.playerHandsLengths[1]}
				/>

				<AIHandContainer
					aiHand={game.players[2].cards}
					horizontal={true}
					style={leftHandStyle}
					cardsCount={game.playerHandsLengths[2]}
				/>
				<AIHandContainer
					aiHand={game.players[3].cards}
					horizontal={false}
					style={rightHandStyle}
					cardsCount={game.playerHandsLengths[3]}
				/>
				<PlayerHand
					isPlayerTurn={game.currentPlayer === 0}
					validMoves={game.validMoves}
					cards={game.players[0].cards}
					cardsCount={game.playerHandsLengths[0]}
				/>
				<DiscardPileContainer>
					<DiscardPile topCard={game.cardManager.lastDiscardPileCard} />
					<Deck
						deck={game.cardManager.deck}
						onClick={game.handleDeckClick}
						currentPlayer={game.currentPlayer}
						previousPlayer={game.previousPlayer}
						numberOfCardsToDraw={game.numberOfCardsToDraw}
						isHighlighted={game.currentPlayer === 0}
					/>
				</DiscardPileContainer>
			</GameBoardStyled>
			{modalOpen && <ModalRender startNewGame={startNewGame} goToMainMenu={goToMainMenu} winner={game.winner} />}
		</DiscardPilePositionContext.Provider>
	);
};

export default observer(GameBoard);