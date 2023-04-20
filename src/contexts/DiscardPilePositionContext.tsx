import { createContext, useContext } from 'react';

interface DiscardPilePositionContextValue {
  position: DOMRect | null
  setPosition: (position: DOMRect | null) => void
}

const DiscardPilePositionContext = createContext<DiscardPilePositionContextValue>({
	position: null,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setPosition: () => {},
});

export const useDiscardPilePosition = () => useContext(DiscardPilePositionContext);

export default DiscardPilePositionContext;
