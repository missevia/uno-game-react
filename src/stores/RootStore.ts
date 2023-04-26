import { GameStore } from './gameStore';

export class RootStore {
	game: GameStore;

	public constructor() {
		this.game = new GameStore(this);
	}
}
