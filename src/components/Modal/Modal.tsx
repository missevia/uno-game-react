import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Backdrop from './Backdrop';
import Button from '../button';

const ModalStyled = styled.div`
    width: clamp(50%, 700px, 90%);
    height: min(50%, 300px);
    color: white;
    margin: auto;
    padding: 7rem 6rem 2rem 6rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
	justify-content: space-between;
    background: linear-gradient(10deg, #ffaa00, #ff6a00);

	p {
		font-weight: bold;
		font-family: "Montserrat", sans-serif;
		font-size: 1.25rem;
		letter-spacing: 1.25px;
	}

	.button-container {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	button {
		width: auto;
		padding: 1rem;
		height: auto;
		border: none;
		outline: none;
		border-radius: 4px;
		font-weight: 600;
		font-size: 1.25rem;
		letter-spacing: 1.25px;
		cursor: pointer;
		font-family: "Montserrat", sans-serif;
	}
`;

const dropIn = {
	hidden: {
		y: '-100vh',
	}, 
	visible: {
		y: '0', 
		opacity: 1, 
		transition: {
			duration: 0.1,
			type: 'spring',
			damping: 25, 
			stiffness: 500
		}
	}, 
	exit: {
		y: '100vh', 
		opacity: 0,
	}
};

interface ModalProps {
    startNewGame: () => void;
	goToMainMenu: () => void;
    text: string;
}
  
const Modal: React.FC<ModalProps> = ({ startNewGame, goToMainMenu, text }) => {
	return (
		<Backdrop>
			<ModalStyled
				as={motion.div}
				// event bubbling; prevent clicks on modal from bubbling to backdrop
				onClick={(e) => e.stopPropagation()}
				variants={dropIn}
				initial='hidden'
				animate='visible'
				exit='exit'
			>
				<p>{text}</p>
				<div className='button-container'>
					<Button onClick={startNewGame} text='New game' />
					<Button onClick={goToMainMenu} text='Main menu' />
				</div>
			</ModalStyled>
		</Backdrop>
	);
};

export default Modal;