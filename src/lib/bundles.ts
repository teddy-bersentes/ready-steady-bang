import type { ResolverManifest } from 'pixi.js'

export enum Bundle {
	MENU_SCREEN = 'menu_screen',
	GAME_SCREEN = 'game_screen'
}

export const bundleManifest: ResolverManifest = {
	bundles: [
		{
			name: Bundle.MENU_SCREEN,
			assets: [
				{
					name: 'menu_animation_part_1',
					srcs: '/animations/menu_1.json'
				},
				{
					name: 'menu_animation_part_2',
					srcs: '/animations/menu_2.json'
				}
			]
		},
		{
			name: Bundle.GAME_SCREEN,
			assets: []
		}
	]
}