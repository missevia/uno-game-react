import { motion } from 'framer-motion';
import styled from 'styled-components';
import React from 'react';

const BackdropStyled = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #000000e1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

interface BackdropProps {
	children: React.ReactNode;
}

const Backdrop: React.FC<BackdropProps> = ({ children }) => {
	return (
		<BackdropStyled
			as={motion.div}
			className="backdrop"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			{children}
		</BackdropStyled>
	);
};

export default Backdrop;
