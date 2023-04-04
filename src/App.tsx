import React from "react";
import { RootStoreContext } from "./hooks/useGameStore";
import { RootStore } from "./stores/RootStore";
import  UnoGame  from "./UnoGame";

const rootStore = new RootStore();

function App() {
	return (
		<RootStoreContext.Provider value={rootStore}>
			<UnoGame />
		</RootStoreContext.Provider>
	);
}

export default App;
