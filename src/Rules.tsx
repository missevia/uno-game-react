import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from './components/button';

const RulesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 6rem;
  margin: 10rem;
  background-color: rgba(30, 14, 111, 0.275);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const RuleList = styled.ol`
  margin-bottom: 2rem;
  li {
    font-size: 1.5rem;
    line-height: 2.5rem;
    color: #fff;
  }
`;

const Header = styled.h1`
  margin-bottom: 2rem;
  font-size: 3rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
`;

const Rules = () => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate('/main-menu');
	};

	return (
		<RulesContainer>
			<Header>UNO GAME RULES</Header>
			<RuleList>
				<li>Objective: Be the first player to get rid of all your cards.</li>
				<li>In this version of the game, you will play against 3 bots.</li>
				<li>Setup: Each player is dealt 7 cards. The remaining cards form a draw pile, and the top card is turned over to start the discard pile.</li>
				<li>Play: Players take turns playing a card from their hand that matches the top card of the discard pile either by color, number, or symbol. If a player cannot play a card, they must draw one from the draw pile.</li>
				<li> When it is your turn to play, your hand and the draw pile will be highlighted, indicating that you can play a card or draw a card from the pile.</li>
				<li>Special cards: Skip, Reverse, Draw Two, Wild, Wild Draw Four.</li>
				<li>Winning: The first player to play all their cards wins the round. The game can be played for a predetermined number of rounds or until a player wins a certain number of rounds (e.g., best of 5 or best of 7).</li>
			</RuleList>
			<Button onClick={handleClick} text='Return to main menu'/>
		</RulesContainer>
	);
};

export default Rules;