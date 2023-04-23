import React from 'react';
import styled from 'styled-components';
import { Card } from '../utils/cardUtils';
import { observer } from 'mobx-react-lite';
import cardBack from '../assets/cards/backside.png';

interface DeckProps {
  deck: Card[]
  onClick: () => void
  currentPlayer: number
  numberOfCardsToDraw: number | null;
  previousPlayer: number;
}

interface DeckStyledProps {
  highlight: boolean;
}

const DeckStyled = styled.div<DeckStyledProps>`
  display: inline-block;
  margin-left: 15rem;
  position: relative;
  filter: ${({ highlight }) => highlight && 'drop-shadow(white 0px 0px 10px)'};
  .card-back {
    position: absolute;
    width: var(--cardWidth);
    height: var(--cardHeight);
    background-image: url(${cardBack});
    background-size: cover;
	box-shadow: rgb(41, 39, 39) 0px 0px 10px;
    border-radius: 8px;
    cursor: pointer;
  }

  h1 {
    font-size: 100rem
  }
`;

const Deck: React.FC<DeckProps> = observer(({ onClick, currentPlayer, deck, numberOfCardsToDraw, previousPlayer }) => {

	const renderAnimatedCards = (count: number) => {
		return Array.from({ length: count }, (_, index) => {
			const cardRef = React.createRef<HTMLDivElement>();
			const animationDelay = index * 100;
			let deltaX = 0;
			let deltaY = 0;

			setTimeout(() => {
				if (cardRef.current) {
					switch (previousPlayer) {
						case 0:
							deltaX = 0;
							deltaY = window.innerHeight * 0.4;
							break;
						case 1:
							deltaX = -window.innerWidth * 0.4;
							deltaY = 0;
							break;
						case 2:
							deltaX = 0;
							deltaY = -window.innerHeight * 0.4;
							break;
						default:
							// currentPlayer === 3
							deltaX = window.innerWidth * 0.4;
							deltaY = 0;
							break;
					}
					cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
					cardRef.current.style.transition = 'transform 1s ease-in-out';

					const onTransitionEnd = () => {
						if (cardRef.current) {
							cardRef.current.style.transform = '';
							cardRef.current.style.transition = '';
							cardRef.current.removeEventListener('transitionend', onTransitionEnd);
						}
					};
					cardRef.current.addEventListener('transitionend', onTransitionEnd);
				}
			}, animationDelay);

			return (
				<div
					key={`animatedCard-${index}`}
					className="card-back"
					ref={cardRef}
					style={{
						zIndex: -index,
					}}
				></div>
			);
		});
	};
	return (
		<DeckStyled highlight={currentPlayer === 0} onClick={onClick}>
			{deck.length > 0 && (
				<div key="defaultCard" className="card-back" onClick={onClick}></div>
			)}
			{numberOfCardsToDraw !== null && numberOfCardsToDraw <= deck.length && renderAnimatedCards(numberOfCardsToDraw)};
		</DeckStyled>
	);
});

export default Deck;