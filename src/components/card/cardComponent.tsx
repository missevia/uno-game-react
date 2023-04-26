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
  isHighlighted?: boolean
  style?: React.CSSProperties
  cardType: CardType;
}

const CardComponent: React.FC<CardComponentProps> = observer(
	({
		card,
		cardIndex,
		isHighlighted = false,
		cardType = CardType.MainPlayerHand,
	}) => {
		const { game } = useGame();
		const cardRef = React.useRef<HTMLDivElement | null>(null);
		const { color, value } = card;
		const showBack = cardType === CardType.AiHand || cardType === CardType.Deck;
		const { cardFrontSrc, valueSrc, blankValueSrc, isNumeric } = getCardImageInfo(card);
		const animateToDiscardPile = useAnimateToDiscardPile(cardRef);

		useEffect(() => {
			if (game.aiPlayerCard === card) {
				animateToDiscardPile(true);
			}
		}, [game.aiPlayerCard]);


		const handleClick = () => {
			if (cardIndex !== undefined && cardType !== CardType.AiHand && isHighlighted) {
			  setTimeout(() => {
					game.playCard(cardIndex);
			  }, 450);
			  animateToDiscardPile(false);
			}
		};

		return (
			<motion.div
				whileHover={
					isHighlighted
						? { y: -40, transition: { duration: 0.3 } }
						: { y: 0, transition: { duration: 0.3 } }
				}
			>
				<StyledCard
					ref={cardRef}
					onClick={handleClick}
					isHighlighted={isHighlighted}
					isMainPlayerHand={cardType === CardType.MainPlayerHand}
					isAiHand={cardType === CardType.AiHand}
					isPile={cardType === CardType.Pile}
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



