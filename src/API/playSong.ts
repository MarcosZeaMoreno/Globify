
import axios from 'axios';

export const playSong = async (uri: string) => {
	const ACCESS_TOKEN = localStorage.getItem("accessToken");
	const SPOTIFY_PLAYER_URL = 'https://api.spotify.com/v1/me/player/play';

	try {
		await axios.put(SPOTIFY_PLAYER_URL, 
			{ uris: [uri] },
			{
				headers: {
					Authorization: `Bearer ${ACCESS_TOKEN}`,
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error) {
		console.error('Error playing song:', error);
		throw error;
	}
};