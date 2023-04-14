import React, { useState } from "react";
import styled from "styled-components";
import { useGame } from "../hooks/useGameStore";
import { observer } from "mobx-react-lite";
import { Card, CardValue } from "../utils/cardUtils";
import { getNumberColor, specialImages, frontImages, numberValues } from "../utils/cardUtils";
import { useDiscardPilePosition } from "../contexts/DiscardPilePositionContext";

const CardContainerStyled = styled.div<Partial<CardComponentProps>>`
	position: absolute;
    width: ${({ aiHand }) => aiHand ? "var(--cardWidthSmall)" : "var(--cardWidth)"};
    height: ${({ aiHand }) => aiHand ? "var(--cardHeightSmall)" : "var(--cardHeight)"}; 
    display: inline-block; 
	filter: ${({ highlight, mainPlayerHand }) => (highlight || !mainPlayerHand) ? "contrast(1)" : "contrast(0.5)"};
    cursor: ${({ highlight }) =>
		highlight ? "pointer" : "default"};
	z-index: ${({ isPile }) =>
		isPile ? "-1" : "1"};
`;

const CardStyled = styled.div<{aiHand: boolean | undefined, isNumeric: boolean}>`
  .card-front {
    position: absolute;
    width: 100%; 
    height: 100%;
    background-color: white;
    border-radius: 13px;
	box-shadow: rgb(41, 39, 39) 0px 0px 10px;
  }

  .card-value, .card-number {
    position: absolute;
    width: 65%;
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
  }

  .card-number {
    font-size: ${({ aiHand }) => aiHand ? "5.25rem" : "7rem"};
    display: flex;
    justify-content: center;
    font-weight: 800;
    text-shadow: black 4px 2px; 
    font-family: sans-serif;
  }

  .card-corner {
    position: absolute;
    font-size: ${({ aiHand }) => aiHand ? "2.1rem" : "2.8rem"};
    font-weight: 800;
    font-family: sans-serif;
	font-style: italic;
	-webkit-text-stroke: 1px black;
  }

  .top-left {
	top: ${({ isNumeric }) => isNumeric ? "1rem" : "1.4rem"};
    left: ${({ isNumeric }) => isNumeric ? "1rem" : "0.9rem"};
  }

  .bottom-right {
	bottom: ${({ isNumeric }) => isNumeric ? "1rem" : "1.4rem"};
    right: ${({ isNumeric }) => isNumeric ? "1rem" : "0.9rem"};
    transform: rotate(180deg);
  }

  .card-corner-image {
    width: 25%;
  }
`;

interface CardComponentProps {
  card: Card;
  cardIndex?: number;
  highlight?: boolean;
  style?: React.CSSProperties;
  mainPlayerHand?: boolean | undefined;
  aiHand?: boolean;
  aiCardMoving?: boolean;
  aiPlayerIndex?: number | null;
  aiPlayerCardIndex?: number | null;
  currentPlayer?: number;
  isPile?: boolean;
}


const CardComponent: React.FC<CardComponentProps> = observer(({ card, cardIndex, highlight, style, mainPlayerHand, aiHand, aiCardMoving, isPile = false }) => {
	const { game } = useGame();
	const { discardPilePosition } = useDiscardPilePosition();
	const cardRef = React.useRef<HTMLDivElement | null>(null);
	const { color, value } = card;
	const [moving, setMoving] = useState(false);
	let cardFrontSrc = frontImages[color];
	let valueSrc;
	let blankValueSrc;
	let isNumeric = false;
	if (card.value === CardValue.Wild) {
		cardFrontSrc = specialImages.wild;
	} else if (numberValues.includes(card.value)) {
		isNumeric = true;
	} else {
		if (value === CardValue.DrawTwo) {
			valueSrc = specialImages.drawTwo[color as keyof typeof specialImages.drawTwo];
			blankValueSrc = specialImages.drawTwo.blank;
		} else if (value === CardValue.Reverse) {
			valueSrc = specialImages.reverse[color as keyof typeof specialImages.reverse];
			blankValueSrc = specialImages.reverse.blank;
		} else if (value === CardValue.Skip) {
			valueSrc = specialImages.skip[color as keyof typeof specialImages.skip];
			blankValueSrc = specialImages.skip.blank;
		} else if (value === CardValue.WildDrawFour) {
			valueSrc = specialImages.drawFour.colour;
			blankValueSrc = specialImages.drawFour.blank;
		}
	}

	const handleClick = () => {
		if (cardIndex !== undefined && discardPilePosition && cardRef.current) {
			setMoving(true);
			// Calculate the X and Y positions for the card to move
			// by subtracting the card's current position from the discard pile's position
			const positionX = discardPilePosition.x - cardRef.current.getBoundingClientRect().x;
			const positionY = discardPilePosition.y - cardRef.current.getBoundingClientRect().y;
			cardRef.current.style.transform = `translate(${positionX}px, ${positionY}px)`;
			cardRef.current.style.transition = "transform 0.5s ease-in-out";
			// timeout for the duration of the animation (0.5 seconds)
			setTimeout(() => {
				game.playCard(cardIndex);
				setMoving(false);
			}, 500); 
		}
	};

	return (
		<CardStyled isNumeric={isNumeric} aiHand={aiHand}>
			<CardContainerStyled ref={cardRef} onClick={handleClick} style={style} highlight={highlight} mainPlayerHand={mainPlayerHand} aiHand={aiHand} isPile={isPile}>
				<img className="card-front" src={cardFrontSrc} alt={`${color} card`} />
				{!isNumeric && value !== CardValue.Wild && (
					<img className="card-value" src={valueSrc} alt={`${color} ${value}`} />
				)}
				{isNumeric && (
					<div className="card-number" style={{ color: getNumberColor(color) }}>
						<span>{value}</span>
					</div>
				)}
				{isNumeric ? (
					<>
						<div className="card-corner top-left" style={{ color: "white" }}>
							<span>{value}</span>
						</div>
						<div className="card-corner bottom-right" style={{ color: "white"}}>
							<span>{value}</span>
						</div>
					</>
				) : (
					<>
						<img className={"card-corner card-corner-image top-left"} src={blankValueSrc} />
						<img className={"card-corner card-corner-image bottom-right"} src={blankValueSrc} />
					</>
				)}
			</CardContainerStyled>
		</CardStyled>
	);
});

export default CardComponent;