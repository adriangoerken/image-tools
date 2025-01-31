import { ReactNode } from 'react';

type ContainerProps = {
	children: ReactNode;
	className?: string;
};

const Container = ({ children, className = '' }: ContainerProps) => {
	return (
		<div className={`container mx-auto p-6 ${className}`}>{children}</div>
	);
};

export default Container;
