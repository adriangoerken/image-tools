import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { MdImage, MdFileDownload, MdCompress } from 'react-icons/md';
import ImageFramer from '../components/tools/ImageFramer';
import SvgConverter from '../components/tools/SvgConverter';
import ImageCompressor from '../components/tools/ImageCompressor';
import { Tool } from '../lib/type';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const MainLayout = () => {
	const [t] = useTranslation('global');
	const [activeTool, setActiveTool] = useState<string>('framer');

	const tools: Tool[] = [
		{
			id: 'framer',
			name: 'Image Framer',
			icon: MdImage,
			component: ImageFramer,
		},
		{
			id: 'svg',
			name: t('Header.links.linkSvg'),
			icon: MdFileDownload,
			component: SvgConverter,
		},
		{
			id: 'compressor',
			name: t('Header.links.linkCompressor'),
			icon: MdCompress,
			component: ImageCompressor,
		},
	];

	useEffect(() => {
		console.log(t('Header.links.linkSvg'));
		console.log(t('Footer.copyright'));
	}, []);

	return (
		<div className="flex flex-col min-h-screen">
			<Header
				activeTool={activeTool}
				setActiveTool={setActiveTool}
				tools={tools}
			/>
			<div className="flex flex-col flex-grow">
				<Outlet context={{ activeTool, tools }} />
			</div>
			<Footer />
		</div>
	);
};

export default MainLayout;
