export const getPlayer = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error('No access token provided');
        }
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch currently playing track');
        }

        const data = await response.json();
        const currentTrack = data.item;
        console.log(currentTrack);
        return currentTrack;
    } catch (error) {
        console.error('Error fetching currently playing track:', error);
    }
};