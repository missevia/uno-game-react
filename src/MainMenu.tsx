// MainMenu.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import unoLogo from './assets/cards/uno-logo.png';
import Button from './components/button';

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
	box-shadow: rgb(41, 39, 39) 0px 0px 10px;
	border-radius: 6px;
`;

const UnoLogo = styled.img`
	width: 19rem;
	position: absolute;
	left: 17rem;
	top: -5rem;
`;

const GameRulesText = styled.p`
  font-size: 1.2rem;
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
				<Button onClick={startGame} text={'Start game'} />
				<GameRulesText onClick={goToRules}>Click here to read game rules</GameRulesText>
			</Menu>
		</MenuContainer>
	);
};

export default MainMenu;
