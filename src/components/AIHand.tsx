import React from "react";
import CardComponent from "./CardComponent";
import { Card } from "../utils/cardUtils";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { v4 as uuidv4 } from "uuid";

const AIHandStyled = styled.div<AIHandStyledProps>`
    display: flex;
    flex-direction: ${({ horizontal }) => (horizontal ? "row" : "column")};
    justify-content: center;
    align-items: ${({ horizontal }) => (horizontal ? "flex-start" : "center")};
    height: ${({ horizontal }) => (horizontal ? "auto" : "100%")};
    width: ${({ horizontal }) => (horizontal ? "100%" : "auto")};
    position: absolute;
    top: ${({ horizontal }) => (horizontal ? "auto" : "10%")};
    left: ${({ horizontal }) => (horizontal ? "-15%" : "auto")};
    right: ${({ right }) => (right ? "6%" : "auto")};
`;

interface AIHandProps {
    aiHand: Card[];
    horizontal: boolean;
    right: boolean;
}

interface AIHandStyledProps extends React.HTMLAttributes<HTMLDivElement> {
    horizontal: boolean;
    right: boolean;
}

const AIHand: React.FC<AIHandProps> = observer(({ aiHand, horizontal, right }) => {
	return (
		<>
			<AIHandStyled horizontal={horizontal} right={right}>
				{aiHand?.map((card, index) => (
					<CardComponent
						key={uuidv4()}
						card={card}
						style={{
							marginLeft: horizontal ? (index * 80) : 0,
							marginTop: horizontal ? 0 : -(index * 80),
							zIndex: index,
						}}
					/>
				))}
			</AIHandStyled>
		</>
	);
});

export default AIHand;