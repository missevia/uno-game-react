import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Backdrop from './Backdrop';
import Button from '../button';

const ModalStyled = styled.div`
    width: clamp(60%, 700px, 90%);
    height: min(50%, 25rem);
    color: white;
    margin: auto;
    padding: 7rem 6rem 2rem 6rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
	justify-content: space-between;
    background-color: rgba(41, 56, 105, 0.8);

	p {
		font-weight: bold;
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
		font-family: 'Bangers';
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
    text: string[];
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
				<p>{text[0]}</p>
				<p>{text[1]}</p>
				<div className='button-container'>
					<Button onClick={startNewGame} text='New game' />
					<Button onClick={goToMainMenu} text='Main menu' />
				</div>
			</ModalStyled>
		</Backdrop>
	);
};

export default Modal;