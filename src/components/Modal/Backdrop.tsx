import { motion } from 'framer-motion';
import styled from 'styled-components';

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
	onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ children, onClick }) => {
	return (
		<BackdropStyled
			as={motion.div}
			className="backdrop"
			onClick={onClick}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			{children}
		</BackdropStyled>
	);
};

export default Backdrop;
