import React, { useRef, useEffect } from 'react';
import CardComponent from './card/cardComponent';
import { Card, CardType } from '../utils/cardUtils';
import { observer } from 'mobx-react-lite';
import { useDiscardPilePosition } from '../contexts/discardPilePositionContext';

interface DiscardPileProps {
  topCard?: Card
}

const DiscardPile: React.FC<DiscardPileProps> = observer(({ topCard }) => {
	const discardPileRef = useRef<HTMLDivElement | null>(null);
	const { setPosition } = useDiscardPilePosition();

	const updatePosition = () => {
		if (discardPileRef.current) {
			setPosition(discardPileRef.current.getBoundingClientRect());
		}
	};

	useEffect(() => {
		updatePosition();
	}, [setPosition]);

	useEffect(() => {
		const handleResize = () => {
			updatePosition();
		};

		window.addEventListener('resize', handleResize);

		// Cleanup event listener when the component is unmounted
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [updatePosition]);

	return (
		<div ref={discardPileRef} style={{zIndex: -20}}>
			{topCard ? <CardComponent card={topCard} cardType={CardType.Pile} /> : <p>No cards in the discard pile yet.</p>}
		</div>
	);
});

export default DiscardPile;
