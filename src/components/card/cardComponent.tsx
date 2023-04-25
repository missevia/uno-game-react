import React, { useState, useEffect } from 'react';
import { useGame } from '../../hooks/useGameStore';
import { observer } from 'mobx-react-lite';
import {
	getNumberColor,
	Card,
	CardValue,
	CardType
} from '../../utils/cardUtils';
import { motion } from 'framer-motion';
import { StyledCard } from './styledCardComponent';
import { getCardImageInfo } from '../../utils/imageUtils';
import { useAnimateToDiscardPile } from '../../hooks/useAnimateToDiscardPile';

interface CardComponentProps {
  card: Card
  cardIndex?: number
  highlight?: boolean
  style?: React.CSSProperties
  mainPlayerHand?: boolean
  aiHand?: boolean
  aiPlayerIndex?: number;
  aiPlayerCard?: Card | null
  currentPlayer?: number
  isPile?: boolean
  playedCardIndex?: number | null
  deck?: boolean;
  deckPosition?: { x: number; y: number };
  noShadow?: boolean
}

const CardComponent: React.FC<CardComponentProps> = observer(
	({
		card,
		cardIndex,
		highlight = false,
		mainPlayerHand = false,
		aiHand = false,
		deck = false,
		isPile,
		noShadow = false
	}) => {
		const { game } = useGame();
		const cardRef = React.useRef<HTMLDivElement | null>(null);
		const { color, value } = card;
		const showBack = aiHand || deck;
		const { cardFrontSrc, valueSrc, blankValueSrc, isNumeric } = getCardImageInfo(card);
		const animateToDiscardPile = useAnimateToDiscardPile(cardRef);

		useEffect(() => {
			if (game.aiPlayerCard === card) {
				animateToDiscardPile(true);
			}
		}, [game.aiPlayerCard]);


		const handleClick = () => {
			if (cardIndex !== undefined && !aiHand && highlight) {
			  setTimeout(() => {
					game.playCard(cardIndex);
			  }, 450);
			  animateToDiscardPile(false);
			}
		  };

		return (
			<motion.div
				whileHover={
					highlight
						? { y: -40, transition: { duration: 0.3 } }
						: { y: 0, transition: { duration: 0.3 } }
				}
			>
				<StyledCard
					ref={cardRef}
					onClick={handleClick}
					highlight={highlight}
					mainPlayerHand={mainPlayerHand}
					aiHand={aiHand}
					isPile={isPile}
					noShadow={noShadow}
				>
					<div className='wrapper'>
						<img className='card-front' src={cardFrontSrc} alt={`${color} card`} />
						<>
							<img className={`card-front ${showBack ? 'card-front-hidden' : ''}`} src={cardFrontSrc} alt={`${color} card`} />
							{!isNumeric && value !== CardValue.Wild && (
								<img className={`card-value ${showBack ? 'card-front-hidden' : ''}`} src={valueSrc} alt={`${color} ${value}`} />
							)}
							{isNumeric && (
								<div className={`card-number ${showBack ? 'card-front-hidden' : ''}`} style={{ color: getNumberColor(color) }}>
									<span>{value}</span>
								</div>
							)}
							{isNumeric ? (
								<>
									<div className={`card-corner top-left ${showBack ? 'card-front-hidden' : ''}`} style={{ color: 'white' }}>
										<span>{value}</span>
									</div>
									<div className={`card-corner bottom-right ${showBack ? 'card-front-hidden' : ''}`} style={{ color: 'white' }}>
										<span>{value}</span>
									</div>
								</>
							) : (
								<>
									<img className={`card-corner card-corner-image top-left ${showBack ? 'card-front-hidden' : ''}`} src={blankValueSrc} />
									<img className={`card-corner card-corner-image bottom-right ${showBack ? 'card-front-hidden' : ''}`} src={blankValueSrc} />
								</>
							)}
						</>
						{showBack && <div className="card-back" />}
					</div>
				</StyledCard>
			</motion.div>
		);
	},
);

export default React.memo(CardComponent);


