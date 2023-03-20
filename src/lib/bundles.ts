import type { ResolverManifest } from 'pixi.js'

export enum Bundle {
	GAME_SCREEN = 'game_screen'
}

export const bundleManifest: ResolverManifest = {
	bundles: [
		{
			name: Bundle.GAME_SCREEN,
			assets: [
				{
					name: 'blood',
					srcs: '/animations/blood.json'
				},
				{
					name: 'bullet_hole',
					srcs: '/animations/bullet_hole.json'
				},
				{
					name: 'summon',
					srcs: '/animations/summon.json'
				},
				{
					name: 'fire',
					srcs: '/animations/fire.json',
				},
				{
					name: 'fear_start',
					srcs: '/animations/fear_start.json',
				},
				{
					name: 'fear_loop',
					srcs: '/animations/fear_loop.json',
				},
				{
					name: 'death',
					srcs: '/animations/death.json',
				}
			]
		}
	]
}