import SectionCard from '../components/SectionCard';
import Container from '../components/Container';
import { useTranslation } from 'react-i18next';

const ImprintPage = () => {
	const [t] = useTranslation('global');
	const [street, city, country] = t(
		'ImprintPage.section1.description.address'
	).split(',');

	return (
		<section>
			<Container>
				<h1 className="text-3xl font-bold mb-8">
					{t('ImprintPage.headerTitle')}
				</h1>
				<p className="text-lg mb-6">{t('ImprintPage.introText')}</p>

				<div className="space-y-6">
					{/* Section 1: Provider */}
					<SectionCard title={t('ImprintPage.section1.title')}>
						<div className="grid gap-2">
							<p className="font-medium">
								{t(
									'ImprintPage.section1.description.companyName'
								)}
							</p>
							<address className="not-italic">
								<p>
									{street}
									<br />
									{city}
									<br />
									{country}
								</p>
							</address>
							<div className="space-y-1">
								<p>
									{t(
										'ImprintPage.section1.description.email'
									)}
								</p>
								<p>
									{t(
										'ImprintPage.section1.description.phone'
									)}
								</p>
								<p>
									{t(
										'ImprintPage.section1.description.website'
									)}
								</p>
							</div>
						</div>
					</SectionCard>

					{/* Section 2: Disclaimer */}
					<SectionCard title={t('ImprintPage.section2.title')}>
						<p>{t('ImprintPage.section2.description')}</p>
					</SectionCard>

					{/* Section 3: Contact */}
					<SectionCard title={t('ImprintPage.section3.title')}>
						<h2 className="text-2xl font-semibold mb-4 border-b pb-2"></h2>
						<p className="mb-4">
							{t('ImprintPage.section3.description')}
						</p>
						<div className="space-y-2">
							<p>{t('ImprintPage.section3.contactInfo.email')}</p>
							<p>{t('ImprintPage.section3.contactInfo.phone')}</p>
						</div>
					</SectionCard>
				</div>
			</Container>
		</section>
	);
};

export default ImprintPage;
