import React from 'react';
import '../styles/navbar.css';
import { useEffect, useState } from 'react';
import { getProfile } from '../API/getUser';
import { searchSongs as fetchSongs } from '../API/searchSongs';
import { playSong } from '../API/playSong';

const Navbar: React.FC = () => {
	const [photoUrl, setPhotoUrl] = useState<string>('');
	const [search, searchSongs] = useState<string>('');
	const [input, setInput] = useState<string>('');
	const [songs, setSongs] = useState<any[]>([]);
	const [showPopup, setShowPopup] = useState<boolean>(false);

	useEffect(() => {
		const fetchPhoto = async () => {
			const data = await getProfile();
			const photo = data.images[0].url;
			setPhotoUrl(photo);
		};

		fetchPhoto();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const popup = document.querySelector('.popup');
			if (popup && !popup.contains(event.target as Node)) {
				setShowPopup(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleSongClick = async (songUri: string) => {
		await playSong(songUri);
		setShowPopup(false);
	};

	return (
		<header>
			<svg className="logo" fill="#FFFFFF" height="70px" width="70px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 305 305" xmlSpace="preserve" stroke="#FFFFFF">
				<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
				<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
				<g id="SVGRepo_iconCarrier">
					<g id="XMLID_85_">
						<path id="XMLID_86_" d="M152.441,0C68.385,0,0,68.39,0,152.453C0,236.568,68.385,305,152.441,305 C236.562,305,305,236.568,305,152.453C305,68.39,236.562,0,152.441,0z M75.08,208.47c17.674-5.38,35.795-8.108,53.857-8.108 c30.676,0,60.96,7.774,87.592,22.49c1.584,0.863,3.024,3.717,3.67,7.27c0.646,3.552,0.389,7.205-0.648,9.105 c-1.309,2.438-3.965,4.014-6.768,4.014c-1.389,0-2.61-0.312-3.831-0.972c-24.448-13.438-52.116-20.542-80.015-20.542 c-16.855,0-33.402,2.495-49.167,7.409c-0.768,0.233-1.558,0.352-2.348,0.352c-3.452,0.001-6.448-2.198-7.453-5.461 C68.612,219.566,71.419,209.667,75.08,208.47z M68.43,152.303c19.699-5.355,40.057-8.071,60.508-8.071 c36.765,0,73.273,8.896,105.601,25.739c2.266,1.15,3.936,3.1,4.701,5.49c0.776,2.421,0.542,5.024-0.669,7.347 c-2.885,5.646-6.257,9.44-8.393,9.44c-1.514,0-2.975-0.363-4.43-1.09c-30.019-15.632-62.59-23.558-96.811-23.558 c-19.035,0-37.71,2.503-55.489,7.435c-0.827,0.224-1.676,0.337-2.521,0.337c-4.277,0.001-8.046-2.888-9.162-7.013 C60.336,162.994,63.601,153.616,68.43,152.303z M66.727,115.606c-0.903,0.223-1.826,0.335-2.744,0.335 c-5.169,0.001-9.648-3.492-10.892-8.487c-1.559-6.323,2.397-13.668,8.126-15.111c22.281-5.473,45.065-8.248,67.72-8.248 c43.856,0,85.857,9.86,124.851,29.312c2.708,1.336,4.727,3.642,5.687,6.493c0.96,2.854,0.748,5.926-0.592,8.64 c-1.826,3.655-5.772,7.59-10.121,7.59c-1.677,0-3.399-0.393-4.924-1.109c-35.819-17.921-74.477-27.008-114.9-27.008 C108.164,108.014,87.234,110.568,66.727,115.606z"></path>
					</g>
				</g>
			</svg>
			<form onSubmit={async (e) => {
				e.preventDefault();
				const results = await fetchSongs(input);
				setSongs(results);
				setShowPopup(true);
			}} id='searchbar'>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
				<input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder='¿Qué quieres reproducir?' />
			</form>
			{showPopup && (
				<div className="popup">
					<div className="popup-content">
						<ul>
							{songs.map((song, index) => (
								<li key={index} onClick={() => handleSongClick(song.uri)}>
									{song.name} by {song.artists[0].name}
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
			<img id="photo" src={photoUrl} alt="Profile" />
		</header>
	)
}

export default Navbar;
