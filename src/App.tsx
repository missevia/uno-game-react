import React from 'react';
import { RootStoreContext } from './hooks/useGameStore';
import { RootStore } from './stores/RootStore';
import UnoGame from './UnoGame';
import Rules from './Rules';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './MainMenu';

const AppStyled = styled.div`
  height: 100vh;
  max-width: 100vw;
`;

const rootStore = new RootStore();

function App() {
	return (
		<Router>
			<RootStoreContext.Provider value={rootStore}>
				<AppStyled>
					<Routes>
						<Route index element={<MainMenu />} />
						<Route path='/main-menu' element={<MainMenu />} />
						<Route path='/game' element={<UnoGame />} />
						<Route path='/rules' element={<Rules />} />
					</Routes>
				</AppStyled>
			</RootStoreContext.Provider>
		</Router>
	);
}

export default App;
