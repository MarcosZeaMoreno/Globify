export const getProfile = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error('No access token provided');
        }
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
};
