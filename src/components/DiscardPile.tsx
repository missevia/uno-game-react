import React, { useRef, useEffect } from "react";
import CardComponent from "./CardComponent";
import { Card } from "../utils/cardUtils";
import { observer } from "mobx-react-lite";
import { useDiscardPilePosition } from "../contexts/DiscardPilePositionContext";


interface DiscardPileProps {
    topCard: Card;
}

const DiscardPile: React.FC<DiscardPileProps> = observer(({ topCard }) => {
	const discardPileRef = useRef<HTMLDivElement | null>(null);
	const { setDiscardPilePosition } = useDiscardPilePosition();

	const updatePosition = () => {
		if (discardPileRef.current) {
			setDiscardPilePosition(discardPileRef.current.getBoundingClientRect());
		}
	};
	
	useEffect(() => {
		updatePosition();
	}, [setDiscardPilePosition]);
	
	useEffect(() => {
		const handleResize = () => {
			updatePosition();
		};
	
		window.addEventListener("resize", handleResize);
	
		// Cleanup event listener when the component is unmounted
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [updatePosition]);
	
	return (
		<div ref={discardPileRef}>
			{topCard ? (
				<CardComponent card={topCard} />
			) : (
				<p>No cards in the discard pile yet.</p>
			)}
		</div>
	);});

export default DiscardPile;