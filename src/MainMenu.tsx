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
  background-image: linear-gradient(to right, rgb(116, 235, 213), rgb(159, 172, 230));
`;

const Menu = styled.div`
	width: 55rem;
	height: 35rem;
	background-color: rgb(54, 70, 118);
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
  font-size: 1.5rem;
  cursor: pointer;
  color: #fff;
  text-decoration: underline;
  margin-top: 9rem;
  margin-bottom: 4rem;
  transition: all 0.3s ease-in-out; 
  &:hover {
    transform: scale(1.09); /* Increase size of button by 5% */
    box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.2); /* Add a more dramatic box-shadow */
  }
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
				<Button onClick={startGame} text={'Start game'} fontSize={3}/>
				<GameRulesText onClick={goToRules}>Game rules</GameRulesText>
			</Menu>
		</MenuContainer>
	);
};

export default MainMenu;
