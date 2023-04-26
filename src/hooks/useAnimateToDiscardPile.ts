import { RefObject } from 'react';
import { useDiscardPilePosition } from '../contexts/discardPilePositionContext';

type AnimateToDiscardPile = (
    cardRef: RefObject<HTMLDivElement>
  ) => (aiPlayer: boolean) => void;

export const useAnimateToDiscardPile: AnimateToDiscardPile = (cardRef) => {
	const { position } = useDiscardPilePosition();;
  
	return () => {
		if (position && cardRef.current) {
			const deltaX = position.x - cardRef.current.getBoundingClientRect().x;
			const deltaY = position.y - cardRef.current.getBoundingClientRect().y;
			cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
			cardRef.current.style.transition = 'transform 0.5s ease-in-out';
  
			const handleTransitionEnd = () => {
				cardRef.current?.remove();
				cardRef.current?.removeEventListener('transitionend', handleTransitionEnd);
			};
  
			cardRef.current.addEventListener('transitionend', handleTransitionEnd);
		}
	};
};