import React, { useState, useEffect } from 'react';
import { RootStoreContext } from './hooks/useGameStore';
import { RootStore } from './stores/rootStore';
import UnoGame from './components/unoGame';
import Rules from './components/rules';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/mainMenu';
import bgMusic from './assets/audio/bg-music.mp3';
import AudioPlayer from './utils/audioPlayer';
import { preloadImages } from './utils/imageUtils';
import { allImages } from './utils/cardUtils';
import Spinner from './components/spinner';

const AppStyled = styled.div`
  height: 100vh;
  max-width: 100vw;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const rootStore = new RootStore();

const App = () => {
	const [playBgMusic, setPlayBgMusic] = useState(false);
	const [assetsLoaded, setAssetsLoaded] = useState(false);

	const playMusic = () => {
		setPlayBgMusic(true);
	};

	useEffect(() => {
		const preloadImagesAsync = async () => {
		  try {
				await preloadImages(allImages);
				console.log('All images preloaded.');
				setAssetsLoaded(true);
		  } catch (err) {
				console.error(err);
		  }
		};
	  
		preloadImagesAsync();
	  }, []);

	  return assetsLoaded ? (
		<Router>
		  <RootStoreContext.Provider value={rootStore}>
				<AudioPlayer audioFile={bgMusic} play={playBgMusic} loop />
				<AppStyled>
					<Routes>
						<Route index element={<MainMenu />} />
						<Route path="/main-menu" element={<MainMenu />} />
						<Route path="/game" element={<UnoGame playMusic={playMusic} />} />
						<Route path="/rules" element={<Rules />} />
					</Routes>
				</AppStyled>
		  </RootStoreContext.Provider>
		</Router>
	  ) : (
		<SpinnerContainer>
			<Spinner /> 
		</SpinnerContainer>
	  );
};

export default App;
