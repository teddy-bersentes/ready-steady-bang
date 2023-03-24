/** @type {import("next").NextConfig} */
module.exports = {
	reactStrictMode: true,
	swcMinify: true,
	publicRuntimeConfig: {
		env: {
			WS_URL: process.env.WS_URL,
		},
	},
};
