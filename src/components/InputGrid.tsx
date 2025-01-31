import { ReactNode } from 'react';

type InputGridProps = {
	children: ReactNode;
};

const InputGrid = ({ children }: InputGridProps) => {
	return <div className="grid grid-cols-2 gap-4">{children}</div>;
};

export default InputGrid;
