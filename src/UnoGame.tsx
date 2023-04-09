import React, { useEffect } from "react";
import { useGame } from "./hooks/useGameStore";
import { observer } from "mobx-react-lite";
import GameBoard from "./components/GameBoard";
import styled from "styled-components";

// TO-DO
// 1. Skip card is not overriden by another skip card
// 2. Re-factor GameStore and move out some of the logic to other files
// 3. Store points of each player (Give each player a name?)
// 4. At the moment only main player (non-AI can start the game)
// 5. Implement the logic - what happens when the deck is empty

const UnoGameStyled = styled.div`
  height: 100vh;
  max-width: 100vw;
`;

const UnoGame = observer(() => {
	const { game } = useGame();

	useEffect(() => {
		if (game) {
			game.startGame();
		}
	}, [game]);

	if (!game) {
		return <div>Loading...</div>;
	}

	return (
		<UnoGameStyled>
			<GameBoard game={game}/>
		</UnoGameStyled>
	);
});

export default UnoGame;

