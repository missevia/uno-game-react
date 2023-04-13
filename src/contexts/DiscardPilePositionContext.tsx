import { createContext, useContext } from "react";

interface DiscardPilePositionContextValue {
    discardPilePosition: DOMRect | null;
    setDiscardPilePosition: (position: DOMRect | null) => void;
}

const DiscardPilePositionContext = createContext<DiscardPilePositionContextValue>({
	discardPilePosition: null,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setDiscardPilePosition: () => {},
});

export const useDiscardPilePosition = () => useContext(DiscardPilePositionContext);

export default DiscardPilePositionContext;