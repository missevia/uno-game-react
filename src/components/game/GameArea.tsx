import React from 'react';
import AIHandContainer from '../AIHand/AiHandContainer';
import PlayerHand from '../PlayerHand';
import DiscardPile from '../DiscardPile';
import Deck from '../Deck';
import { GameStore } from '../../stores/GameStore';

interface GameAreaProps {
  game: GameStore;
  aiPlayedCardIndex?: number;
}

const GameArea: React.FC<GameAreaProps> = ({ game, aiPlayedCardIndex }) => {
	return (
		<>
			<div className='game-info'>
				<h1>{`Current player: ${game.currentPlayer === 0 ? 'You' : `Bot number ${game.currentPlayer}`}`}</h1>
			</div>
			<AIHandContainer
				aiHand={game.players[1].cards}
				horizontal={false}
				aiPlayerIndex={0}
				playedCardIndex={aiPlayedCardIndex}
				cardsCount={game.playerHandsLengths[1]}
			/>
			<AIHandContainer
				aiHand={game.players[2].cards}
				horizontal={true}
				style={{
					left: '50%',
				}}
				aiPlayerIndex={1}
				playedCardIndex={aiPlayedCardIndex}
				cardsCount={game.playerHandsLengths[2]}
			/>
			<AIHandContainer
				aiHand={game.players[3].cards}
				horizontal={false}
				style={{
					right: 'var(--cardWidth)',
				}}
				aiPlayerIndex={2}
				playedCardIndex={aiPlayedCardIndex}
				cardsCount={game.playerHandsLengths[3]}
			/>
			<PlayerHand
				isPlayerTurn={game.currentPlayer === 0}
				validMoves={game.validMoves}
				cards={game.players[0].cards}
				cardsCount={game.playerHandsLengths[0]}
				currentPlayer={game.currentPlayer}
			/>
			<div className="deck-and-discard">
				<DiscardPile topCard={game.cardManager.lastDiscardPileCard} />
				<Deck
					deck={game.cardManager.deck}
					onClick={game.handleDeckClick}
					currentPlayer={game.currentPlayer}
					previousPlayer={game.previousPlayer}
					numberOfCardsToDraw={game.numberOfCardsToDraw}
				/>
			</div>
		</>
	);
};

export default GameArea;