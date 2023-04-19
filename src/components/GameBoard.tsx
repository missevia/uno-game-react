import React, { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import PlayerHand from './PlayerHand';
import AIHand from './AIHand';
import DiscardPile from './DiscardPile';
import Deck from './Deck';
import styled from 'styled-components';
import { GameStore } from '../stores/GameStore';
import DiscardPilePositionContext from '../contexts/DiscardPilePositionContext';
import { toJS } from 'mobx';
import { AnimatePresence, motion } from 'framer-motion';
import Modal from './Modal/Modal';


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
  game: GameStore
}

const GameBoard: React.FC<GameBoardProps> = ({ game }) => {
	const [discardPilePosition, setDiscardPilePosition] = useState<DOMRect | null>(null);
	const [aiPlayedCardIndex, setAiPlayedCardIndex] = useState<number>();
	const [modalOpen, setModalOpen] = useState(false);

	const close = () => setModalOpen(false);
	const open = () => setModalOpen(true);
	

	// TEMP console.log to check if any special card is now active (DrawTwo, DrawFour)
	useEffect(() => {
		if (game.activeSpecialCard) {
			console.log('ACTIVE SPECIAL CARD', game.activeSpecialCard);
		}
	}, [game.activeSpecialCard]);

	useEffect(() => {
		if (!game.gameInProgress && game.winner) {
			open();
		}
	}, [game.gameInProgress, game.winner]);

	// const context = useMemo(() => ({ discardPilePosition: discardPilePosition, setDiscardPilePosition: setDiscardPilePosition }), [discardPilePosition]);

	// useEffect(() => {
	// 	console.log('aiHand', toJS(game.aiHands));
	// }, [game.aiHands]);
	if (!game.gameInProgress && game.winner) {
		return (
			<>
				{/* <motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => (modalOpen ? close() : open())}
				>
		Launch modal
				</motion.button> */}
				<AnimatePresence
					initial={false}
					mode="wait"
				>
					{modalOpen && <Modal handleClose={close} text={`Player number ${game.winner} won!!`} />}
				</AnimatePresence>
			</>
		);

	} 

	if (!game.gameInProgress || game.players.length === 0) {
		return null;
	}



	return (
		<DiscardPilePositionContext.Provider
			value={{ position: discardPilePosition, setPosition: setDiscardPilePosition }}
		>
			<GameBoardStyled>
				<div className='game-info'>
					<h1>{`Current player: ${game.currentPlayer}`}</h1>
					<h1>{game.gameInProgress ? 'Game in progress' : 'Game over'}</h1>
				</div>
				<button onClick={game.resetGame}>Reset game</button>

				<AIHand
					aiHand={game.players[1].cards}
					horizontal={false}
					aiPlayerIndex={0}
					// remove this
					playedCardIndex={aiPlayedCardIndex}
				/>

				<AIHand
					aiHand={game.players[2].cards}
					horizontal={true}
					style={{
						left: '50%',
					}}
					aiPlayerIndex={1}
					playedCardIndex={aiPlayedCardIndex}
				/>
				<AIHand
					aiHand={game.players[3].cards}
					horizontal={false}
					style={{
						right: 'var(--cardWidthSmall)',
					}}
					aiPlayerIndex={2}
					playedCardIndex={aiPlayedCardIndex}
				/>
				<PlayerHand
					isPlayerTurn={game.currentPlayer === 0}
					validMoves={game.validMoves}
					cards={game.playerHand}
					// playerHand={game.playerHand}
					// remove this
					currentPlayer={game.currentPlayer}
				/>
				<div className='deck-discard'>
					<DiscardPile topCard={game.cardManager.lastDiscardPileCard} />
					<Deck
						deck={game.cardManager.deck}
						onClick={game.handleDeckClick}
						currentPlayer={game.currentPlayer}
					/>
				</div>
			</GameBoardStyled>
		</DiscardPilePositionContext.Provider>
	);
};

export default observer(GameBoard);
