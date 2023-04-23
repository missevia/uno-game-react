import React, { useEffect, useRef } from 'react';
import { useGame } from './hooks/useGameStore';
import { observer } from 'mobx-react-lite';
import GameBoard from './components/game/GameBoard';
import styled from 'styled-components';

const UnoGameStyled = styled.div`
  height: 100vh;
  max-width: 100vw;
`;

const UnoGame = observer(() => {
	const { game } = useGame();
	const initialized = useRef(false);

	useEffect(() => {
		if (game && !initialized.current) {
			game.startGame();
			initialized.current = true;
		}
	}, [game]);

	// useEffect(() => {
	// 	if (game.gameInProgress) {
	// 		game.resetGame();
	// 	}
	// }, [game.gameInProgress]);

	if (!game) {
		return null;
	}

	return (
		<UnoGameStyled>
			{initialized && (
				<GameBoard game={game} />
			)}
		</UnoGameStyled>
	);
});

export default UnoGame;
