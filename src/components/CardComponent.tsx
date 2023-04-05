import React from "react";
import styled from "styled-components";
import { useGame } from "../hooks/useGameStore";
import { observer } from "mobx-react-lite";
import { Card, CardColor, CardValue } from "../utils/cardUtils";
import {
	frontWild,
	frontBlue,
	frontGreen,
	frontRed,
	frontYellow,
	drawFour,
	drawTwoBlue,
	drawTwoGreen,
	drawTwoRed,
	drawTwoYellow,
	reverseYellow,
	reverseBlue,
	reverseGreen,
	reverseRed,
	skipBlue,
	skipGreen,
	skipRed,
	skipYellow,
	wild,
} from "./CardImages";

const numberValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

interface CardStyledProps {
  highlight?: boolean;
}

const CardStyled = styled.div<CardStyledProps>`
  .card-container {
    position: absolute;
    width: 100px;
    height: 150px; 
    display: inline-block; 
    margin-right: 10px; 
    box-shadow: ${({ highlight }) =>
		highlight ? "0 0 5px 5px rgba(255, 255, 0, 0.5)" : "none"};
    cursor: ${({ highlight }) =>
		highlight ? "pointer" : "default"};
  }
   
  .card-front {
    position: absolute;
    width: 100%; 
    height: 100%;
    background-color: white;
    border-radius: 4px;
  }

  .card-value, .card-number {
    position: absolute;
    width: 65%;
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
  }

  .card-number {
    font-size: 7rem;
    display: flex;
    justify-content: center;
    font-weight: 800;
    text-shadow: black 4px 2px; 
    font-family: sans-serif;
  }
`;

interface CardComponentProps {
  card: Card;
  cardIndex?: number;
  highlight?: boolean;
  style?: React.CSSProperties;
}

const frontImages = {
	wild: frontWild,
	blue: frontBlue,
	green: frontGreen,
	red: frontRed,
	yellow: frontYellow,
};

const specialImages = {
	drawFour: drawFour,
	drawTwo: {
		blue: drawTwoBlue,
		green: drawTwoGreen,
		red: drawTwoRed,
		yellow: drawTwoYellow,
	},
	reverse: {
		blue: reverseBlue,
		green: reverseGreen,
		red: reverseRed,
		yellow: reverseYellow,
	},
	skip: {
		blue: skipBlue,
		green: skipGreen,
		red: skipRed,
		yellow: skipYellow,
	},
	wild: wild,
};

const CardComponent: React.FC<CardComponentProps> = observer(({ card, cardIndex, highlight, style }) => {
	const { game } = useGame();
	const { color, value } = card;
	let cardFrontSrc = frontImages[color];
	let valueSrc;
	let isNumeric = false;
	if (card.value === CardValue.Wild) {
		cardFrontSrc = specialImages.wild;
	} else if (numberValues.includes(card.value)) {
		isNumeric = true;
	} else {
		if (value === CardValue.DrawTwo) {
			valueSrc = specialImages.drawTwo[color as keyof typeof specialImages.drawTwo];
		} else if (value === CardValue.Reverse) {
			valueSrc = specialImages.reverse[color as keyof typeof specialImages.reverse];
		} else if (value === CardValue.Skip) {
			valueSrc = specialImages.skip[color as keyof typeof specialImages.skip];
		} else if (value === CardValue.WildDrawFour) {
			valueSrc = specialImages.drawFour;
		}
	}

	const getNumberColor = (color: CardColor): string => {
		switch (color) {
		case "blue":
			return "#3545F8";
		case "green":
			return "#1DE544";
		case "red":
			return "#F83434";
		case "yellow":
			return "#F9F716";
		default:
			return "white";
		}
	};
  
	const handleClick = () => {
		if (cardIndex !== undefined) {
			game.playCard(cardIndex);
		}
	};

	return (
		<CardStyled highlight={highlight}>
			<div className="card-container" onClick={handleClick} style={style}>
				<img className="card-front" src={cardFrontSrc} alt={`${color} card`} />
				{!isNumeric && value !== CardValue.Wild && (
					<img className="card-value" src={valueSrc} alt={`${color} ${value}`} />
				)}
				{isNumeric && (
					<div className="card-number" style={{ color: getNumberColor(color) }}>
						<span>{value}</span>
					</div>
				)}
			</div>
		</CardStyled>
	);
});

export default CardComponent;