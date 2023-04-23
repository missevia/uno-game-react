import React, { useState, useEffect } from 'react';
import { useGame } from '../../hooks/useGameStore';
import { observer } from 'mobx-react-lite';
import {
	getNumberColor,
	specialImages,
	frontImages,
	numberValues,
	Card,
	CardValue,
} from '../../utils/cardUtils';
import { useDiscardPilePosition } from '../../contexts/DiscardPilePositionContext';
import { motion } from 'framer-motion';
import { CardStyled } from './CardStyled';
import AudioPlayer from '../../utils/audioPlayer';
import sound from '../../assets/audio/play.mp3';

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
		// style,
		mainPlayerHand = false,
		aiHand = false,
		deck = false,
		isPile,
		noShadow = false
	}) => {
		const { game } = useGame();
		const { position } = useDiscardPilePosition();
		const cardRef = React.useRef<HTMLDivElement | null>(null);
		const { color, value } = card;
		const [hovered, setHovered] = useState(false);
		const [showBack, setShowBack] = useState(aiHand || deck);
		const [playAiSound, setPlayAiSound] = useState(false);
		const [playSound, setPlaySound] = useState(false);

		let cardFrontSrc = frontImages[color];
		let valueSrc;
		let blankValueSrc;
		let isNumeric = false;
		if (card.value === CardValue.Wild) {
			cardFrontSrc = specialImages.wild;
		} else if (numberValues.includes(card.value)) {
			isNumeric = true;
		} else {
			// move this to separate utils function
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

		// move to another file - create a class Audio

		const animateToDiscardPile = (aiPlayer: boolean) => {
			if (position && cardRef.current) {
				aiPlayer && setPlayAiSound(true);
				console.log('position:', position, 'cardRef.current:', cardRef.current);
				const deltaX = position.x - cardRef.current.getBoundingClientRect().x;
				const deltaY = aiPlayer
					? position.y - cardRef.current.getBoundingClientRect().y
					: position.y - cardRef.current.getBoundingClientRect().y - 40;
				cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
				cardRef.current.style.transition = 'transform 0.5s ease-in-out';
				const handleTransitionEnd = () => {
					cardRef.current?.remove();
					cardRef.current?.removeEventListener('transitionend', handleTransitionEnd);
					aiPlayer && setPlayAiSound(false);
				  };
			  
				  cardRef.current.addEventListener('transitionend', handleTransitionEnd);
			}
			
		};

		useEffect(() => {
			if (game.aiPlayerCard === card) {
				console.log('game.aiPlayerCard:', JSON.stringify(game.aiPlayerCard), 'card:', JSON.stringify(card));
				animateToDiscardPile(true);
			}
		}, [game.aiPlayerCard, card]);


		const handleClick = () => {
			if (cardIndex !== undefined && !aiHand && highlight) {
				// setPlaySound(true);
			  setTimeout(() => {
					game.playCard(cardIndex);
			  }, 500);
			  animateToDiscardPile(false);
			}
		  };

		//   useEffect(() => {
		// 	if (playSound) {
		// 	  animateToDiscardPile(false);
		// 	}
		//   }, [playSound]);

		return (
			<div>
				<CardStyled
					ref={cardRef}
					onClick={handleClick}
					highlight={highlight}
					mainPlayerHand={mainPlayerHand}
					aiHand={aiHand}
					isPile={isPile}
					noShadow={noShadow}
					as={motion.div}
					hovered={hovered}
					onHoverStart={() => setHovered(true)}
					onHoverEnd={() => setHovered(false)} 
					whileHover={
						highlight
							? { y: -40, transition: { duration: 0.3 } }
							: { y: 0, transition: { duration: 0.3 } }
					}
				>	
					<div className='wrapper'>
						<img className='card-front' src={cardFrontSrc} alt={`${color} card`} />
						{!showBack && (
							<>
								<img className='card-front' src={cardFrontSrc} alt={`${color} card`} />
								{!isNumeric && value !== CardValue.Wild && (
									<img className='card-value' src={valueSrc} alt={`${color} ${value}`} />
								)}
								{isNumeric && (
									<div className='card-number' style={{ color: getNumberColor(color) }}>
										<span>{value}</span>
									</div>
								)}
								{isNumeric ? (
									<>
										<div className='card-corner top-left' style={{ color: 'white' }}>
											<span>{value}</span>
										</div>
										<div className='card-corner bottom-right' style={{ color: 'white' }}>
											<span>{value}</span>
										</div>
									</>
								) : (
									<>
										<img className={'card-corner card-corner-image top-left'} src={blankValueSrc} />
										<img className={'card-corner card-corner-image bottom-right'} src={blankValueSrc} />
									</>
								)}
							</>
						)}
						{showBack && <div className="card-back" />}
						{/* <AudioPlayer audioFile={sound} play={playSound || playAiSound} />  */}
					</div>
		
				</CardStyled>
			</div>
		);
	},
);

export default React.memo(CardComponent);



