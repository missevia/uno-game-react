import React from 'react';
import styled from 'styled-components';


const StyledButton = styled.button<{fontSize: number}>`
  background-color: #F8DB22;
  border: none;
  border-radius: 5px;
  letter-spacing: 0.3rem;
  box-shadow: var(--boxShadow);;
  font-weight: 800;
  /* font-size: 2.4rem; */
  padding: 1rem 2rem;
  height: 5rem;
  transition: all 0.3s ease-in-out; 
  cursor: pointer;
  &:hover {
    transform: scale(1.05); /* Increase size of button by 5% */
    box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.2); /* Add a more dramatic box-shadow */
  }
  span {
	color: white;
    font-size: ${({ fontSize }) => `${fontSize}rem`};;
	-webkit-text-stroke: 0.07rem black; /* for Safari/WebKit-based browsers */
    font-family: 'Bangers';
     /* text-stroke: 2px black;  */
	/* Add transition effect for hover state */
  }
`;

interface ButtonProps {
    text: string;
    onClick?: () => void;
    fontSize: number;
}

const Button: React.FC<ButtonProps>  = ({ text, onClick, fontSize }) => {
	return (
		<StyledButton onClick={onClick} fontSize={fontSize}>
			<span>
				{text}
			</span>
		</StyledButton>
	);
};

export default Button;