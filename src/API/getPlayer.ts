declare global {
	interface Window {
		hasDisplayedLastTrack: boolean;
	}
}

export const getPlayer = async () => {
	try {
		const token = localStorage.getItem("accessToken");
		if (!token) {
			throw new Error('No access token provided');
		}

		// Intentar obtener la canción actualmente reproduciéndose
		const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		if (!response.ok) {
			throw new Error('Failed to fetch currently playing track');
		}

		const responseText = await response.text();
		const data = responseText ? JSON.parse(responseText) : null;

		// Si hay una canción sonando, mostrarla
		if (data && data.item) {
			const currentTrack = data.item;
			return currentTrack;
		}

		// Si no hay canción sonando, intentamos obtener la última reproducida, pero solo una vez
		let lastTrack = null;
		if (!window.hasDisplayedLastTrack) { // Controla si ya se mostró la última canción
			console.log("No song or episode currently playing. Fetching recently played track...");

			// Intentar obtener la última canción/episodio reproducido
			const recentlyPlayedResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
				headers: {
					Authorization: 'Bearer ' + token
				}
			});

			if (!recentlyPlayedResponse.ok) {
				throw new Error('Failed to fetch recently played tracks');
			}

			const recentlyPlayedData = await recentlyPlayedResponse.json();
			lastTrack = recentlyPlayedData.items[0]; // Obtener el primer item, que es el más reciente

			if (!lastTrack) {
				console.log("No recently played track found.");
				return null;
			}

			window.hasDisplayedLastTrack = true;
		}

		// Si ya se ha mostrado algo, no hacemos nada más
		return lastTrack;
	} catch (error) {
		console.error('Error fetching currently playing track:', error);
	}
};
