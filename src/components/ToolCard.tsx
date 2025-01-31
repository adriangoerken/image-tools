import { ReactNode } from 'react';

type ToolCardProps = {
	children: ReactNode;
};

const ToolCard = ({ children }: ToolCardProps) => {
	return (
		<div className="max-w-2xl mx-auto bg-elevation-300 rounded-lg shadow-xl">
			{children}
		</div>
	);
};

export default ToolCard;
