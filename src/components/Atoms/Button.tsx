import React, { ReactNode } from 'react';

type ButtonProps = {
	children: ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	className?: string;
};

const Button = ({
	children,
	onClick,
	disabled = false,
	className,
}: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`bg-green-700 text-white py-2 px-4 rounded-full hover:bg-green-800 transition disabled:opacity-50 w-fit ${className}`}
		>
			{children}
		</button>
	);
};

export default Button;
