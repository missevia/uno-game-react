import React, { useEffect } from "react";
import { useGame } from "./hooks/useGameStore";
import { observer } from "mobx-react-lite";
import GameBoard from "./components/GameBoard";

// TO-DO
// 1. Implement functionality - when wild draw 4 card has already been used by one player, the next one can play any card on it and if clicks on the deck only will draw 1 card
// 2. Implement reverse functionality
// 3. when draw 2 card has already been used by one player, the next player would only draw 1 card when clicking on the deck
// 4 Implement skip next player functionality

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
		<div>
			<h1>Uno game</h1>
			<GameBoard />
		</div>
	);
});

export default UnoGame;

