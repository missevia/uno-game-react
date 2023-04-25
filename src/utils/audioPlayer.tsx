import React, { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  audioFile: string;
  play: boolean;
  loop?: boolean;
  onEnd?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioFile, play, onEnd, loop }) => {
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
        
		const handleEnded = () => {
			if (audioRef.current && onEnd) {
				onEnd();
			}
		};

		if (play && audioRef.current) {
			audioRef.current.play();
			audioRef.current.addEventListener('ended', handleEnded);
		}

		return () => {
			if (audioRef.current) {
				audioRef.current.removeEventListener('ended', handleEnded);
			}
		};
	}, [play, onEnd]);

	return <audio ref={audioRef} src={audioFile} loop={loop} />;
};

export default AudioPlayer;