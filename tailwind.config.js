/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Ubuntu', 'Roboto', 'sans-serif'],
			},
			colors: {
				'custom-gray': '#151515',
				'elevation-100': '#1D1D1D',
				'elevation-200': '#1E1E1E',
				'elevation-300': '#1f1f1f',
			},
			objectPosition: {
				'custom-top': '50% 30%',
			},
		},
	},
	plugins: [],
};
