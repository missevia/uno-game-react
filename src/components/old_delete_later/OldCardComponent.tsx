// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { useGame } from '../hooks/useGameStore';
// import { observer } from 'mobx-react-lite';
// import {
// 	getNumberColor,
// 	specialImages,
// 	frontImages,
// 	numberValues,
// 	Card,
// 	CardValue,
// } from '../utils/cardUtils';
// import { useDiscardPilePosition } from '../contexts/DiscardPilePositionContext';
// import { motion } from 'framer-motion';
// import cardBack from '../assets/cards/backside.png';

// type ExtendedCardComponentProps = Partial<CardComponentProps> & { isNumeric: boolean };

// const CardWrapperStyled = styled.div<Partial<ExtendedCardComponentProps>>`

// 	.wrapper {
// 		position: absolute;
// 		width: ${({ aiHand }) => (aiHand ? 'var(--cardWidthSmall)' : 'var(--cardWidth)')};
// 		height: ${({ aiHand }) => (aiHand ? 'var(--cardHeightSmall)' : 'var(--cardHeight)')};
// 		display: inline-block;
// 		filter: ${({ highlight, mainPlayerHand }) =>
// 		highlight || !mainPlayerHand ? 'contrast(1)' : 'contrast(0.5)'};
// 		cursor: ${({ highlight }) => (highlight ? 'pointer' : 'default')};
// 		z-index: ${({ isPile }) => (isPile ? '-1' : '1')};
// 	}


//   .card-front {
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     background-color: white;
//     border-radius: 13px;
// 	// fix it
// 	box-shadow: ${({ noShadow }) => (noShadow ? 'none' : 'rgb(41, 39, 39) 0px 0px 10px;')};
//   }

//   .card-value,
//   .card-number {
//     position: absolute;
//     width: 65%;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//   }

//   .card-number {
//     font-size: 7rem;
//     display: flex;
//     justify-content: center;
//     font-weight: 800;
//     text-shadow: black 4px 2px;
//     font-family: sans-serif;
//   }

//   .card-back {
//     width: 100%;
//     height: 100%;
//     background-image: url(${cardBack});
//     background-size: cover;
//     border-radius: 4px;
//     cursor: pointer;

//     position: absolute; 
//     top: 0; 
//     left: 0; 
//   }

//   .card-corner {
//     position: absolute;
//     font-size: 2.8rem;
//     font-weight: 800;
//     font-family: sans-serif;
//     font-style: italic;
//     -webkit-text-stroke: 1px black;
//   }

//   .top-left {
//     top: ${({ isNumeric }) => (isNumeric ? '1rem' : '1.4rem')};
//     left: ${({ isNumeric }) => (isNumeric ? '1rem' : '0.9rem')};
//   }

//   .bottom-right {
//     bottom: ${({ isNumeric }) => (isNumeric ? '1rem' : '1.4rem')};
//     right: ${({ isNumeric }) => (isNumeric ? '1rem' : '0.9rem')};
//     transform: rotate(180deg);
//   }

//   .card-corner-image {
//     width: 25%;
//   }
// `;

// const CardContentStyled = styled.div<{ aiHand: boolean | undefined; isNumeric: boolean, noShadow: boolean }>`
  
// `;

// interface CardComponentProps {
//   card: Card
//   cardIndex?: number
//   highlight?: boolean
//   style?: React.CSSProperties
//   mainPlayerHand?: boolean
//   aiHand?: boolean
//   aiPlayerIndex?: number;
//   aiPlayerCard?: Card | null
//   currentPlayer?: number
//   isPile?: boolean
//   playedCardIndex?: number | null
//   deck?: boolean;
//   deckPosition?: { x: number; y: number };
//   noShadow?: boolean
// }

// const CardComponent: React.FC<CardComponentProps> = observer(
// 	({
// 		card,
// 		cardIndex,
// 		highlight = false,
// 		style,
// 		mainPlayerHand = false,
// 		aiHand = false,
// 		deck = false,
// 		isPile,
// 		aiPlayerIndex,
// 		currentPlayer,
// 		aiPlayerCard,
// 		playedCardIndex,
// 		deckPosition, 
// 		noShadow = false
// 	}) => {
// 		const { game } = useGame();
// 		const { position } = useDiscardPilePosition();
// 		const cardRef = React.useRef<HTMLDivElement | null>(null);
// 		const { color, value } = card;
// 		// const [animationTarget, setAnimationTarget] = useState({ x: 0, y: 0 });
// 		const [showBack, setShowBack] = useState(aiHand || deck);
// 		const [cardClicked, setCardClicked] = useState(false);
// 		// const [initialPosition, setInitialPosition] = useState<{ x: number; y: number } | null>(null);
// 		let cardFrontSrc = frontImages[color];
// 		let valueSrc;
// 		let blankValueSrc;
// 		let isNumeric = false;
// 		if (card.value === CardValue.Wild) {
// 			cardFrontSrc = specialImages.wild;
// 		} else if (numberValues.includes(card.value)) {
// 			isNumeric = true;
// 		} else {
// 			// move this to separate utils function
// 			if (value === CardValue.DrawTwo) {
// 				valueSrc = specialImages.drawTwo[color as keyof typeof specialImages.drawTwo];
// 				blankValueSrc = specialImages.drawTwo.blank;
// 			} else if (value === CardValue.Reverse) {
// 				valueSrc = specialImages.reverse[color as keyof typeof specialImages.reverse];
// 				blankValueSrc = specialImages.reverse.blank;
// 			} else if (value === CardValue.Skip) {
// 				valueSrc = specialImages.skip[color as keyof typeof specialImages.skip];
// 				blankValueSrc = specialImages.skip.blank;
// 			} else if (value === CardValue.WildDrawFour) {
// 				valueSrc = specialImages.drawFour.colour;
// 				blankValueSrc = specialImages.drawFour.blank;
// 			}
// 		}

// 		const animateToDiscardPile = () => {
// 			if (position && cardRef.current) {
// 			  const deltaX = position.x - cardRef.current.getBoundingClientRect().x;
// 			  const deltaY = position.y - cardRef.current.getBoundingClientRect().y - 40;
// 			  cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
// 			  cardRef.current.style.transition = 'transform 0.5s ease-in-out';
// 			}
// 		};

// 		useEffect(() => {
// 			if (aiPlayerIndex === 0) {
// 				console.log('***AiHand', JSON.stringify(card));
// 			}
// 		}, [card, aiPlayerIndex]);


// 		const handleClick = () => {
// 			if (cardIndex !== undefined) {
// 			  setTimeout(() => {
// 					game.playCard(cardIndex);
// 			  }, 500);
// 			  animateToDiscardPile();
// 			}
// 		  };

// 		return (
// 			<CardWrapperStyled
// 				ref={cardRef}
// 				onClick={handleClick}
// 				style={style}
// 				highlight={highlight}
// 				mainPlayerHand={mainPlayerHand}
// 				aiHand={aiHand}
// 				isPile={isPile}
// 				noShadow={noShadow}
// 				as={motion.div}
// 				// animate={animationTarget}
// 				// transition={{ duration: 0.5, ease: 'easeInOut' }}
// 				whileHover={
// 					highlight
// 						? { y: -40, transition: { duration: 0.3 } }
// 						: { y: 0, transition: { duration: 0.3 } }
// 				}
// 			>	
// 				<div className='wrapper'>
// 					<img className='card-front' src={cardFrontSrc} alt={`${color} card`} />
// 					{!showBack && (
// 						<>
// 							<img className='card-front' src={cardFrontSrc} alt={`${color} card`} />
// 							{!isNumeric && value !== CardValue.Wild && (
// 								<img className='card-value' src={valueSrc} alt={`${color} ${value}`} />
// 							)}
// 							{isNumeric && (
// 								<div className='card-number' style={{ color: getNumberColor(color) }}>
// 									<span>{value}</span>
// 								</div>
// 							)}
// 							{isNumeric ? (
// 								<>
// 									<div className='card-corner top-left' style={{ color: 'white' }}>
// 										<span>{value}</span>
// 									</div>
// 									<div className='card-corner bottom-right' style={{ color: 'white' }}>
// 										<span>{value}</span>
// 									</div>
// 								</>
// 							) : (
// 								<>
// 									<img className={'card-corner card-corner-image top-left'} src={blankValueSrc} />
// 									<img className={'card-corner card-corner-image bottom-right'} src={blankValueSrc} />
// 								</>
// 							)}
// 						</>
// 					)}
// 					{showBack && <div className="card-back" />}
// 				</div>
		
// 			</CardWrapperStyled>
// 		);
// 	},
// );

// export default React.memo(CardComponent);

// // current bug: the currentPlayer is changed before the animation is complete

// // const animateToPlayerFromDiscardPile = () => {
// // 	if (cardRef.current && position) {
// // 	  const deltaX = position.x - cardRef.current.getBoundingClientRect().x;
// // 	  const deltaY = position.y - cardRef.current.getBoundingClientRect().y;
// // 	  cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
// // 	  cardRef.current.style.transition = 'transform 0.6s ease-in-out';
	  
// // 	  setTimeout(() => {
// // 			if (cardRef.current) {
// // 				cardRef.current.style.transform = '';
// // 				cardRef.current.style.transition = '';
// // 			}
// // 	  }, 600);
// // 	}
// //   };

// // useEffect(() => {
// // 	console.log('****', [game.aiPlayerCard?.id, card.id]);
// // 	if (
// // 		// ((aiPlayerIndex && game.aiPlaying && (aiPlayerIndex + 1 === game.currentPlayer)) || !game.aiPlaying) &&
// // 		game.aiPlayerCard?.id === card.id &&
// // 		game.aiPlayerCardPlayed && 
// // 		position &&
// // 		cardRef.current
// // 	) {
// // 		console.log('****', [game.aiPlayerCard?.id, card.id]);
// // 		animateToDiscardPile();
// // 	}
// // }, [game.aiPlayerCard, game.aiPlayerCardPlayed, position]);


