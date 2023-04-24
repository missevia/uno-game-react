import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Modal from './Modal';

interface ModalRenderProps {
  startNewGame: () => void;
  goToMainMenu: () => void;
  winner: number | null;
}

const ModalRender: React.FC<ModalRenderProps> = ({ startNewGame, goToMainMenu, winner }) => {

	const winMessage = winner === 0 ? 'You won! :)' : 'You lost! :(';
	return (
		<>
			<AnimatePresence initial={true} mode="wait">
				<Modal startNewGame={startNewGame} goToMainMenu={goToMainMenu} text={winMessage} />
			</AnimatePresence>
		</>
	);
};

export default ModalRender;