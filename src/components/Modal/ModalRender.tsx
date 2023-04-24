import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Modal from './Modal';

interface ModalRenderProps {
  startNewGame: () => void;
  goToMainMenu: () => void;
  winner: number | null;
}

const winningMessages = [
	'You\'ve outwitted your opponents! The crown is yours! 👑', 
	'You\'ve conquered the challenge! Well played, champ! 🏆', 
	'You\'ve emerged victorious! Glory is yours! 🌟', 
	'A round of applause for the master of the game! 👏', 
	'Huzzah! Victory is yours! 🎉'
];

const losingMessages = [
	'Remember, defeat is just a stepping stone to victory! 🌉',
	'Keep your chin up, and try again! 💪',
	'Ah, the bittersweet taste of defeat. Better luck next time! 🍀', 
	'The cards may have been stacked against you, but your time to shine will come! 💫',
	'Life\'s a game of cards – sometimes you win, sometimes you lose. Keep playing! 🃏', 
	'The tides of fortune may have turned, but don\'t worry – you\'ll ride the waves to victory soon! 🌊'
];

const ModalRender: React.FC<ModalRenderProps> = ({ startNewGame, goToMainMenu, winner }) => {
	const [winMessage, setWinMessage] = useState<string[]>([]);
	const getRandomMessage = (messages: string[]) => messages[Math.floor(Math.random() * messages.length)];

	useEffect(() => {
		if (winner === 0) {
			setWinMessage(['You won!', getRandomMessage(winningMessages)]);
		} else {
			setWinMessage(['You lost!', getRandomMessage(losingMessages)]);
		}
	}, [winner]);
	// const winMessage = winner === 0 ? ['You won!', getRandomMessage(winningMessages)] : ['You lost!', getRandomMessage(losingMessages)];
	return (
		<>
			<AnimatePresence initial={true} mode="wait">
				<Modal startNewGame={startNewGame} goToMainMenu={goToMainMenu} text={winMessage} />
			</AnimatePresence>
		</>
	);
};

export default ModalRender;