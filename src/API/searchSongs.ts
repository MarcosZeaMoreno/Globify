import axios from 'axios';

export const searchSongs = async (query: string) => {

	const SPOTIFY_API_URL = 'https://api.spotify.com/v1/search';
	const ACCESS_TOKEN = localStorage.getItem("accessToken");

	try {
		const response = await axios.get<{ tracks: { items: any[] } }>(SPOTIFY_API_URL, {
			headers: {
				Authorization: `Bearer ${ACCESS_TOKEN}`
			},
			params: {
				q: query,
				type: 'track'
			}
		});

		return response.data.tracks.items;
	} catch (error) {
		console.error('Error searching songs:', error);
		throw error;
	}

}