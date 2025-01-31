import SectionCard from '../components/SectionCard';
import Container from '../components/Container';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyPage = () => {
	const [t] = useTranslation('global');
	const [street, city, country] = t(
		'PrivacyPolicyPage.section3.contactInfo.address'
	).split(',');

	return (
		<section>
			<Container>
				<h1 className="text-3xl font-bold mb-8 text-center">
					{t('PrivacyPolicyPage.headerTitle')}
				</h1>
				<p className="text-lg mb-6 text-center">
					{t('PrivacyPolicyPage.introText')}
				</p>

				<div className="space-y-6">
					{/* Section 1 */}
					<SectionCard title={t('PrivacyPolicyPage.section1.title')}>
						<p className="mb-4">
							{t('PrivacyPolicyPage.section1.description')}
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								{t(
									'PrivacyPolicyPage.section1.list.personalInfo'
								)}
							</li>
							<li>
								{t('PrivacyPolicyPage.section1.list.cookies')}
							</li>
							<li>
								{t('PrivacyPolicyPage.section1.list.tracking')}
							</li>
						</ul>
					</SectionCard>

					{/* Section 2 */}
					<SectionCard title={t('PrivacyPolicyPage.section2.title')}>
						<p>{t('PrivacyPolicyPage.section2.description')}</p>
					</SectionCard>

					{/* Section 3: Contact */}
					<SectionCard title={t('PrivacyPolicyPage.section3.title')}>
						<p className="mb-4">
							{t('PrivacyPolicyPage.section3.description')}
						</p>
						<div className="space-y-2">
							<p className="font-medium">
								{t(
									'PrivacyPolicyPage.section3.contactInfo.companyName'
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
							<p>
								{t(
									'PrivacyPolicyPage.section3.contactInfo.email'
								)}
							</p>
							<p>
								{t(
									'PrivacyPolicyPage.section3.contactInfo.phone'
								)}
							</p>
						</div>
					</SectionCard>

					{/* Section 4 */}
					<SectionCard title={t('PrivacyPolicyPage.section4.title')}>
						<p>{t('PrivacyPolicyPage.section4.description')}</p>
					</SectionCard>
				</div>
			</Container>
		</section>
	);
};

export default PrivacyPolicyPage;
