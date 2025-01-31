import { ReactNode } from 'react';

type SectionCardProps = {
	title: string;
	children: ReactNode;
};

const SectionCard = ({ title, children }: SectionCardProps) => {
	return (
		<div className="bg-elevation-300 p-4 rounded-xl">
			<h2 className="text-3xl font-semibold tracking-normal text-white mb-2">
				{title}
			</h2>
			{children}
		</div>
	);
};

export default SectionCard;
