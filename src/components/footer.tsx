import React, { useEffect, useState } from 'react';
import '../styles/footer.css';

// Extend the Window interface to include onSpotifyWebPlaybackSDKReady
declare global {
	interface Window {
		onSpotifyWebPlaybackSDKReady: () => void;
		Spotify: typeof Spotify;
	}
}

interface TrackInfo {
	album: {
		images: { url: string }[];
	};
	name: string;
	artists: { name: string }[];
	duration_ms: number;
	progress_ms: number;
	is_playing: boolean;
}

const Footer = () => {
	const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null);
	const [rangeValue, setRangeValue] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [player, setPlayer] = useState<any | null>(null);

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (!token) {
			throw new Error('No access token provided');
		}

		const script = document.createElement('script');
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;

		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new window.Spotify.Player({
				name: 'Web Playback SDK',
				getOAuthToken: cb => { cb(token); },
				volume: 0.5
			});

			setPlayer(player);

			player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);
				// Transfer playback to the Web Playback SDK
				fetch(`https://api.spotify.com/v1/me/player`, {
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						device_ids: [device_id],
						play: true
					})
				}).then(response => {
					if (!response.ok) {
						throw new Error('Failed to transfer playback');
					}
					console.log('Playback transferred to Web Playback SDK');
				}).catch(error => {
					console.error('Error transferring playback:', error);
				});
			});

			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});

			player.addListener('player_state_changed', state => {
				if (state) {
					setIsPlaying(!state.paused);
					setTrackInfo({
						album: state.track_window.current_track.album,
						name: state.track_window.current_track.name,
						artists: state.track_window.current_track.artists,
						duration_ms: state.duration,
						progress_ms: state.position,
						is_playing: !state.paused
					});
					setRangeValue((state.position / state.duration) * 100);
				}
			});

			player.connect();
		};

		return () => {
			if (player) {
				player.disconnect();
			}
		};
	}, []);

	const handleRangeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = parseInt(e.target.value);
		setRangeValue(newValue);
		const newPosition = (newValue / 100) * duration;
		await setPlayerPosition(newPosition);
	};

	const setPlayerPosition = async (position: number) => {
		const token = localStorage.getItem("accessToken");
		if (!token) {
			throw new Error('No access token provided');
		}
		try {
			await fetch('https://api.spotify.com/v1/me/player/seek', {
				method: 'PUT',
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ position_ms: position })
			});
		} catch (error) {
			console.error('Failed to set player position:', error);
		}
	};

	const handlePlayPause = async () => {
		if (player) {
			if (isPlaying) {
				await player.pause();
			} else {
				await player.resume();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const handleNext = async () => {
		if (player) {
			await player.nextTrack();
		}
	};

	const handlePrevious = async () => {
		if (player) {
			await player.previousTrack();
		}
	};

	const formatTime = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

	return (
		<footer>
			<div id="left">
				{trackInfo && trackInfo.album && trackInfo.album.images && (
					<>
						<img src={trackInfo.album.images[0].url} alt="Album Photo" id="album" />
						<div>
							<h5>{trackInfo.name}</h5>
							<p>{trackInfo.artists.map(artist => artist.name).join(', ')}</p>
						</div>
					</>
				)}
			</div>
			<div id="middle">
				<div id="control-panel">
					<button id="previous" onClick={handlePrevious}>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M15 18L9 12L15 6V18Z" fill="currentColor" />
							<path d="M9 18V6H7V18H9Z" fill="currentColor" />
						</svg>
					</button>
					<button id="play" onClick={handlePlayPause}>
						{isPlaying ? (
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="currentColor" />
							</svg>
						) : (
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
							</svg>
						)}
					</button>
					<button id="next" onClick={handleNext}>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M9 18L15 12L9 6V18Z" fill="currentColor" />
							<path d="M15 18V6H17V18H15Z" fill="currentColor" />
						</svg>
					</button>
				</div>
				<div id="time-display">
					<span>{trackInfo ? formatTime(trackInfo.progress_ms) : '0:00'}</span>
					<input
						type="range"
						min="0"
						max="100"
						value={rangeValue}
						onChange={handleRangeChange}
						style={{ '--range-value': `${rangeValue}%` } as React.CSSProperties}
					/>
					<span>{trackInfo ? formatTime(trackInfo.duration_ms) : '0:00'}</span>
				</div>
			</div>
			<div id="right">
				<p>derecha</p>
			</div>
		</footer>
	);
}

export default Footer;