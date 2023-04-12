// MainMenu.js
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const MainMenuStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StartGameButton = styled.button`
  font-size: 2.4rem;
  padding: 1rem 2rem;
  cursor: pointer;
`;

const MainMenu = () => {
	const navigate = useNavigate();

	const startGame = () => {
		navigate("/game");
	};

	return (
		<MainMenuStyled>
			<StartGameButton onClick={startGame}>Start Game</StartGameButton>
		</MainMenuStyled>
	);
};

export default MainMenu;