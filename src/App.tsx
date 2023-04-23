import React, {useState } from 'react';
import { RootStoreContext } from './hooks/useGameStore';
import { RootStore } from './stores/RootStore';
import UnoGame from './UnoGame';
import Rules from './Rules';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './MainMenu';
import bgMusic from './assets/audio/bg-music.mp3';
import AudioPlayer from './utils/audioPlayer';

const AppStyled = styled.div`
  height: 100vh;
  max-width: 100vw;
`;

const rootStore = new RootStore();

function App() {
	const [playBgMusic, setPlayBgMusic] = useState(false);

	const playMusic = () => {
		setPlayBgMusic(false);
	};

	return (
		<Router>
			<RootStoreContext.Provider value={rootStore}>
				<AudioPlayer audioFile={bgMusic} play={playBgMusic} />
				<AppStyled>
					<Routes>
						<Route index element={<MainMenu playMusic={playMusic} />} />
						<Route path='/main-menu' element={<MainMenu playMusic={playMusic} />} />
						<Route path='/game' element={<UnoGame />} />
						<Route path='/rules' element={<Rules />} />
					</Routes>
				</AppStyled>
			</RootStoreContext.Provider>
		</Router>
	);
}

export default App;
