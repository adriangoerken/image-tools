import React from 'react';

type SelectProps = {
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	options: { value: string; label: string }[];
};

const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => {
	return (
		<div>
			<label className="block mb-2">{label}</label>
			<select
				value={value}
				onChange={onChange}
				className="mt-1 block w-full py-2 px-4 border rounded-lg bg-elevation-100 hover:cursor-pointer"
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default Select;
