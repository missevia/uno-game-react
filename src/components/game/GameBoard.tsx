import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { GameStore } from '../../stores/GameStore';
import DiscardPilePositionContext from '../../contexts/DiscardPilePositionContext';
import GameArea from './GameArea';
import ModalRender from '../Modal/ModalRender';


const GameBoardStyled = styled.div`
  height: 100vh;
  max-width: 100vw;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  /* background:  linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);
  z-index: -2; */

  .game-info {
    position: absolute;
    top: 30%;
    left: 40%;
  }

  .deck-and-discard {
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
	const navigate = useNavigate();

	const close = () => setModalOpen(false);
	const open = () => setModalOpen(true);
	

	// TEMP console.log to check if any special card is now active (DrawTwo, DrawFour)
	useEffect(() => {
		if (game.activeSpecialCard) {
			console.log('ACTIVE SPECIAL CARD', game.activeSpecialCard);
		} else {
			console.log('ACTIVE SPECIAL CARD IS NULL');
		}
	}, [game.activeSpecialCard]);

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

	// const context = useMemo(() => ({ discardPilePosition: discardPilePosition, setDiscardPilePosition: setDiscardPilePosition }), [discardPilePosition]);

	if (game.players.length === 0) {
		return null;
	}

	return (
		<DiscardPilePositionContext.Provider
			value={{ position: discardPilePosition, setPosition: setDiscardPilePosition }}
		>
			<GameBoardStyled>
				<div className='game-info'>
					<h1>{`Current player: ${game.currentPlayer === 0 ? 'You' : `Bot number ${game.currentPlayer}`}`}</h1>
				</div>
				<GameArea game={game} aiPlayedCardIndex={aiPlayedCardIndex}/>
			</GameBoardStyled>
			{modalOpen && <ModalRender startNewGame={startNewGame} goToMainMenu={goToMainMenu} winner={game.winner} />}
		</DiscardPilePositionContext.Provider>
	);
};

export default observer(GameBoard);