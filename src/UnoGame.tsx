import React, { useEffect } from 'react';
import { useGame } from './hooks/useGameStore';
import { observer } from 'mobx-react-lite';
import GameBoard from './components/GameBoard';

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

