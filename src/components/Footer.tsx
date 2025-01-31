import React from 'react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import { useLocation } from 'react-router-dom';
import { getLanguage } from '../utils/utils';
import { useState } from 'react';
import FooterLink from './Atoms/FooterLink';

const Footer = () => {
	const [t, i18n] = useTranslation('global');
	const [currentLang, setCurrentLang] = useState(
		getLanguage().substring(0, 2)
	);

	const year = new Date().getFullYear();
	const location = useLocation();
	const currentPath = location.pathname;

	const handleChangeLanguage = (lang: string) => {
		i18n.changeLanguage(lang);
		setCurrentLang(lang);
	};

	return (
		<footer className="bg-elevation-300 text-white py-8">
			<Container>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
					<div className="text-center md:text-left">
						<h3 className="text-2xl font-bold mb-2 tracking-wider">
							Adrian Goerken
						</h3>
						<p>
							&copy; {year}, {t('Footer.copyright')}
						</p>
					</div>
					<div className="flex flex-col md:flex-row flex-wrap gap-x-4 gap-y-2 md:gap-y-0 text-center flex-1 justify-center">
						{currentPath !== '/' ? (
							<FooterLink
								to="/"
								text={t('Footer.links.linkHome')}
							/>
						) : (
							''
						)}
						<FooterLink
							to="/imprint"
							text={t('Footer.links.linkImprint')}
						/>
						<FooterLink
							to="/privacy-policy"
							text={t('Footer.links.linkPrivacy')}
						/>
					</div>
					<div className="flex gap-2 justify-self-center md:justify-self-end">
						{['de', 'en'].map((lang, index, arr) => (
							<React.Fragment key={lang}>
								<span
									key={lang}
									onClick={() => handleChangeLanguage(lang)}
									className={`border-b-2 border-b-transparent text-lg cursor-pointer text-white hover:border-b-white ${
										currentLang === lang
											? 'border-b-white'
											: ''
									}`}
								>
									{lang.toUpperCase()}
								</span>
								{index < arr.length - 1 && (
									<span className="text-xl text-white">
										|
									</span>
								)}
							</React.Fragment>
						))}
					</div>
				</div>
			</Container>
		</footer>
	);
};

export default Footer;
