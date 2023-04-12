import React from "react";
import CardComponent from "./CardComponent";
import { Card } from "../utils/cardUtils";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { v4 as uuidv4 } from "uuid";

// change the styles - vertical AI hands are not diplayed correctly

const AIHandContainer = styled.div<{horizontal: boolean}>`
  position: fixed;
  width: ${({ horizontal }) => horizontal ? "40vw" : "auto"}; 
  height: ${({ horizontal }) => horizontal ? "auto" : "50vh"}; 
  transform: ${({ horizontal }) => horizontal ? "translateX(-50%)" : "translateY(-50%)"};
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
}

const AIHand: React.FC<AIHandProps> = observer(({ aiHand, horizontal, style }) => {
	// simplify the stylings here and move some of the variables to :root (index.css file)
	const containerMaxWidth = 50; // in vw
	const containerMaxHeight = 50; // in vh
	const cardWidth = 8; // in rem
	const cardHeight = 13; // in rem
	const cardsCount = aiHand && aiHand.length;
	const cardOverlapX = Math.max(
		0,
		Math.min(
			((cardWidth * cardsCount * window.innerWidth) / 100 - (containerMaxWidth * window.innerWidth) / 100) /
		(cardsCount - 1),
			(cardWidth * window.innerWidth) / 100 / 3
		)
	);
	const cardOverlapY = Math.max(
		0,
		Math.min(
			((cardHeight * cardsCount * window.innerWidth) / 100 - (containerMaxHeight * window.innerWidth) / 100) /
		(cardsCount - 1),
			(cardHeight * window.innerWidth) / 100 / 3
		)
	);
	return (
		<AIHandContainer horizontal={horizontal} style={style}>
			<AIHandStyled horizontal={horizontal}>
				{aiHand?.map((card, index) => (
					<CardComponent
						key={uuidv4()}
						card={card}
						aiHand
						style={{
							marginLeft: horizontal ? -cardOverlapX : 0,
							marginTop: horizontal ? 0 : -cardOverlapY,
							zIndex: index,
						}}
					/>
				))}
			</AIHandStyled>
		</AIHandContainer>
	);
});

export default AIHand;