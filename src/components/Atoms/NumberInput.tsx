import React from 'react';

type NumberInputProps = {
	label: string;
	value: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const NumberInput = ({ label, value, onChange }: NumberInputProps) => {
	return (
		<div>
			<label className="block">{label}</label>
			<input
				type="number"
				value={value}
				onChange={onChange}
				className="mt-1 block w-full py-2 px-4 border rounded-lg bg-elevation-100"
			/>
		</div>
	);
};

export default NumberInput;
