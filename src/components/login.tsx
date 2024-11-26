import React from 'react';
import '../styles/login.css';

export default function Login() {
	const handleClick = () => {
	  const callbackUrl = `http://localhost:5173/home`;
	  const client_id = "42795664fac94d9c9b9c5652dc320701";
	  const scopes = [
		'ugc-image-upload',
		'user-read-recently-played',
		'user-top-read',
		'user-read-playback-position',
		'user-read-playback-state',
		'user-modify-playback-state',
		'user-read-currently-playing',
		'playlist-modify-public',
		'playlist-modify-private',
		'playlist-read-private',
		'playlist-read-collaborative',
		'app-remote-control',
		'streaming',
		'user-follow-modify',
		'user-follow-read',
		'user-library-read',
		'user-library-modify',
		'user-read-email',
		'user-read-private'
	  ].join('%20');
	  const targetUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=${scopes}`;
	  window.location.href = targetUrl;
	};
  return (
	<section id="login" className="root">
				<div>
					<img alt="Globify icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/512px-Spotify_icon.svg.png?20220821125323"></img>
					<h2>Globify</h2>
				</div>
				<button onClick={handleClick}>Login with Spotify</button>
	</section>
  );
}
