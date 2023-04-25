import React, { useEffect, useRef, useState } from 'react';
import { useGame } from './hooks/useGameStore';
import { observer } from 'mobx-react-lite';
import GameBoard from './components/GameBoard';
import styled from 'styled-components';

const UnoGameStyled = styled.div`
  height: 100vh;
  max-width: 100vw;
`;

const UnoGame = observer(() => {
	const { game } = useGame();
	const initialized = useRef(false);
	const [gameStarted, setGameStarted] = useState(false);

	useEffect(() => {
		if (game && !initialized.current) {
			game.startGame();
			initialized.current = true;
			setGameStarted(true);
		}
	}, [game]);

	if (!game) {
		return null;
	}

	return (
		<UnoGameStyled>
			{initialized && (
				<GameBoard game={game} initialized={gameStarted} />
			)}
		</UnoGameStyled>
	);
});

export default UnoGame;
