import React from 'react';
import styled from 'styled-components';


const StyledButton = styled.button`
  background-color: #F8DB22;
  border: none;
  border-radius: 5px;
  letter-spacing: 0.3rem;
  box-shadow: rgb(41, 39, 39) 0px 0px 10px;
  font-weight: 800;
  font-size: 2.4rem;
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
	-webkit-text-stroke: 0.07rem black; /* for Safari/WebKit-based browsers */
    font-family: 'Bangers';
     /* text-stroke: 2px black;  */
	/* Add transition effect for hover state */
  }
`;

interface ButtonProps {
    text: string;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps>  = ({ text, onClick }) => {
	return (
		<StyledButton onClick={onClick}>
			<span>
				{text}
			</span>
		</StyledButton>
	);
};

export default Button;