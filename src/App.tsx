import React from "react";
import { RootStoreContext } from "./hooks/useGameStore";
import { RootStore } from "./stores/RootStore";
import  UnoGame  from "./UnoGame";
import styled from "styled-components";

const AppStyled = styled.div`
  height: 100vh;
  max-width: 100vw;
`;

const rootStore = new RootStore();

function App() {
	return (
		<RootStoreContext.Provider value={rootStore}>
			<AppStyled>
				<UnoGame />
			</AppStyled>
		</RootStoreContext.Provider>
	);
}

export default App;
