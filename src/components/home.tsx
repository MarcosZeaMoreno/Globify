import React from 'react';
import { useEffect } from 'react';
import '../styles/home.css'
import '../styles/App.css'
import Navbar from './navbar';
import Left from "./left";
import Footer from './footer';

const Secure: React.FC = () => {
	useEffect(() => {
		const hash = window.location.hash;
		const accessTokenMatch = hash.match(/access_token=([^&]*)/);

		if (accessTokenMatch) {
			const accessToken = accessTokenMatch[1];
			localStorage.setItem("accessToken", accessToken);
			window.history.replaceState(null, '', window.location.pathname);
		} else {
			console.log("No access token found in the URL");
		}
	}, []);

	return (
		<section id='home'>
			<Navbar />
			<main>
				<Left />
			</main>
			<Footer />
		</section>
	);
};

export default Secure;