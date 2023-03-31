import { GameStore } from "./GameStore";

export class RootStore {
    game: GameStore;

    public constructor() {
        this.game = new GameStore(this);
    }
}
