// MainMenu.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import unoLogo from './assets/cards/uno-logo.png';

const MenuContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Menu = styled.div`
	width: 55rem;
	height: 35rem;
	background-color: #1e0e6f46;
	display: flex;
	position: relative;
	justify-content: flex-end;
	align-items: center;
	flex-direction: column;
	padding-top: 12rem;
  /* display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column; */
`;

const StartGameButton = styled.button`
  font-size: 2.4rem;
  padding: 1rem 2rem;
  height: 5rem;
  cursor: pointer;
`;

const UnoLogo = styled.img`
	width: 19rem;
	position: absolute;
	left: 17rem;
	top: -5rem;
`;

const GameRulesText = styled.p`
  /* position: absolute; */
  /* bottom: 5rem; */
  font-size: 1.2rem;
  /* left: 20rem; */
  cursor: pointer;
  color: #fff;
  text-decoration: underline;
  margin-top: 9rem;
  margin-bottom: 4rem;
`;

const MainMenu = () => {
	const navigate = useNavigate();

	const startGame = () => {
		navigate('/game');
	};

	const goToRules = () => {
		navigate('/rules');
	};

	return (
		<MenuContainer>
			<Menu>
				<UnoLogo src={unoLogo} alt='uno-logo' />
				<StartGameButton onClick={startGame}>Start Game</StartGameButton>
				<GameRulesText onClick={goToRules}>Click here to read game rules</GameRulesText>
			</Menu>
		</MenuContainer>
	);
};

export default MainMenu;
