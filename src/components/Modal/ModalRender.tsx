import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Modal from './Modal';

interface ModalRenderProps {
  startNewGame: () => void;
  goToMainMenu: () => void;
  winner: number | null;
}

const ModalRender: React.FC<ModalRenderProps> = ({ startNewGame, goToMainMenu, winner }) => {
	return (
		<>
			<AnimatePresence initial={true} mode="wait">
				<Modal startNewGame={startNewGame} goToMainMenu={goToMainMenu} text={`Player number ${winner} won!!`} />
			</AnimatePresence>
		</>
	);
};

export default ModalRender;