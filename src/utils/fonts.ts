import localFont from 'next/font/local'

export const uniFont = localFont({
	variable: '--font-uni',
	src: [
		{
			path: '../../public/fonts/uni05_53.ttf',
			weight: '400',
			style: 'normal'
		},
		{
			path: '../../public/fonts/uni05_54.ttf',
			weight: '500',
			style: 'normal'
		}
	]
})