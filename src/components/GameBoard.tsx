import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PlayerHand from './PlayerHand';
import AIHand from './AIHand';
import DiscardPile from './DiscardPile';
import { useGame } from '../hooks/useGameStore';
import Deck from './Deck';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const GameBoardStyled = styled.div`
    display: flex;
    flex-direction: column;
`
const GameBoard: React.FC = () => {
    const { game } = useGame();

    const handleDeckClick = () => {
        // check the top card of the discard pile 
        // if card === wildDrawFour, draw four cards
        // if card === drawTwo, draw two cards
        // else, draw 1 card
        const topDiscardCard = game.discardPile[game.discardPile.length - 1]
        if (game.currentPlayer === 0) {
          console.log('topDiscardValue', topDiscardCard.value)
          if (topDiscardCard.value === 'drawTwo') {
            const newCards = game.drawCards(2);
            game.addCardsToPlayerHand(newCards);
          } else if (topDiscardCard.value === 'drawFour') {
            const newCards = game.drawCards(4);
            game.addCardsToPlayerHand(newCards);
          } else {
            const newCard = game.drawCard();
            game.addCardsToPlayerHand([newCard]);
          }

          game.changeTurn()
            // Check if it's an AI player's turn after the player draws a card
            if (game.currentPlayer !== 0) {
                game.aiPlayCard(game.currentPlayer - 1);
            }
        }
    };

    return (
        <div>
            {game.gameInProgress ? (
                <h1>Game in progress</h1>
            ) : (
                <h1>Game over</h1>
            )}
            <h1>{`Current player: ${game.currentPlayer}`}</h1>
            {/* <h1>{`Game status: ${toJS(game.gameStatus)}`}</h1> */}
            <PlayerHand />
        
            <div className="ai-hands">
                {game.aiHands.map((aiHand, handIndex) => (
                    <AIHand key={uuidv4()} handIndex={handIndex} aiHand={[...aiHand]} />
                ))}
            </div>
            <DiscardPile topCard={game.discardPile[game.discardPile.length - 1]} />
            <Deck deck={game.deck} onClick={handleDeckClick} />
        </div>
)}

export default observer(GameBoard);