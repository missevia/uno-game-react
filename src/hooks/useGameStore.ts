import { useContext, createContext } from 'react';
import type { RootStore } from '../stores/RootStore';

export const RootStoreContext = createContext<RootStore | null>(null);

export function useGame() {
	const store = useContext(RootStoreContext);
	if (!store) {
		throw new Error('Game should be provided');
	}
	return store;
}
