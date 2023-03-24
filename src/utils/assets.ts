import type { ResolverManifest } from 'pixi.js'

export enum Bundle {
	GAME_SCREEN = 'game_screen'
}

export enum AnimationName {
	BLOOD = 'blood',
	BULLET_HOLE = 'bullet_hole',
	SUMMON = 'summon',
	FIRE = 'fire',
	FEAR_START = 'fear_start',
	FEAR_LOOP = 'fear_loop',
	DEATH = 'death'
}

export enum TextureName {
	COWBOY_ARM = 'cowboy-arm',
	COWBOY_BODY = 'cowboy-body'
}

export const bundleManifest: ResolverManifest = {
	bundles: [
		{
			name: Bundle.GAME_SCREEN,
			assets: [
				{
					name: AnimationName.BLOOD,
					srcs: '/animations/blood.json'
				},
				{
					name: AnimationName.BULLET_HOLE,
					srcs: '/animations/bullet_hole.json'
				},
				{
					name: AnimationName.SUMMON,
					srcs: '/animations/summon.json'
				},
				{
					name: AnimationName.FIRE,
					srcs: '/animations/fire.json'
				},
				{
					name: AnimationName.FEAR_START,
					srcs: '/animations/fear_start.json'
				},
				{
					name: AnimationName.FEAR_LOOP,
					srcs: '/animations/fear_loop.json'
				},
				{
					name: AnimationName.DEATH,
					srcs: '/animations/death.json'
				},
				{
					name: TextureName.COWBOY_ARM,
					srcs: '/images/cowboy-arm.png'
				},
				{
					name: TextureName.COWBOY_BODY,
					srcs: '/images/cowboy-body.png'
				}
			]
		}
	]
}