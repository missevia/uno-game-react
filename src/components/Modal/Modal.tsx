import { motion } from 'framer-motion';
import styled from 'styled-components';
import Backdrop from './Backdrop';

const ModalStyled = styled.div`
    // add gradient
    // using clamp instead of media queries
    width: clamp(50%, 700px, 90%);
    height: min(50%, 300px);

    margin: auto;
    padding: 0 2rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: red;

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
    handleClose: () => void;
    text: string;
}
  
const Modal: React.FC<ModalProps> = ({ handleClose, text }) => {
	return (
		<Backdrop onClick={handleClose}>
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
				<button onClick={handleClose}>Close</button>
			</ModalStyled>
		</Backdrop>
	);
};

export default Modal;