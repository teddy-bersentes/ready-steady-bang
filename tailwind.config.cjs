const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
const config = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-uni)", ...fontFamily.sans],
			},
			colors: {
				"cowboy-gray": {
					50: "#FAFAFA",
					75: "#F5F5F5",
					100: "#EBEBEB",
					150: "#E0E0E0",
					200: "#D6D6D6",
					300: "#C2C2C2",
					400: "#ADADAD",
					500: "#999999",
					600: "#858585",
					650: "#7F7F7F",
					700: "#707070",
					800: "#5C5C5C",
					850: "#555555",
					900: "#474747",
				},
				"cowboy-black": {
					100: "#333333",
					200: "#1F1F1F",
					300: "#0A0A0A",
				},
				"cowboy-gold": {
					50: "#E5D360",
					100: "#DEC102",
				},
			},
		},
	},
	plugins: [],
};

module.exports = config;
