import React from "react";
import CardComponent from "./CardComponent";
import { Card } from "../utils/cardUtils";
import styled from "styled-components";
import { observer } from "mobx-react-lite";

const AIHandContainer = styled.div<{horizontal: boolean}>`
  position: fixed;
  top: ${({ horizontal }) => horizontal ? "auto" : "50%"}; 
  width: ${({ horizontal }) => horizontal ? "40vw" : "auto"}; 
  height: ${({ horizontal }) => horizontal ? "auto" : "50vh"}; 
  transform: ${({ horizontal }) => horizontal ? "translateX(-50%)" : "translateY(-70%)"};
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
`;

const AIHandStyled = styled.div<{ horizontal: boolean }>`
	display: flex;
  	justify-content: space-between;
	flex-direction: ${({ horizontal }) => horizontal ? "row" : "column"}; 
  	width: ${({ horizontal }) => horizontal ? "100%" : "auto"}; 
	height: ${({ horizontal }) => horizontal ? "auto" : "100%"}; 
`;

interface AIHandProps {
    aiHand: Card[];
    horizontal: boolean;
	style?: React.CSSProperties;
	aiCardMoving: boolean;
}

const AIHand: React.FC<AIHandProps> = observer(({ aiHand, horizontal, style, aiCardMoving }) => {
	console.log("%c⧭", "color: #733d00", aiHand, horizontal, style, aiCardMoving);
	return (
		<AIHandContainer horizontal={horizontal} style={style}>
			<AIHandStyled horizontal={horizontal}>
				{aiHand?.map((card, index) => (
					<CardComponent
						key={"" + index + card.value + card.color}
						card={card}
						aiHand
						aiCardMoving={aiCardMoving}
					/>
				))}
			</AIHandStyled>
		</AIHandContainer>
	);
});

export default AIHand;