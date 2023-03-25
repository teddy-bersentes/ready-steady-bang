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

const gameBundleAssets: Record<AnimationName | TextureName, string> = {
	[AnimationName.BLOOD]: '/animations/blood.json',
	[AnimationName.BULLET_HOLE]: '/animations/bullet_hole.json',
	[AnimationName.SUMMON]: '/animations/summon.json',
	[AnimationName.FIRE]: '/animations/fire.json',
	[AnimationName.FEAR_START]: '/animations/fear_start.json',
	[AnimationName.FEAR_LOOP]: '/animations/fear_loop.json',
	[AnimationName.DEATH]: '/animations/death.json',
	[TextureName.COWBOY_ARM]: '/images/cowboy-arm.png',
	[TextureName.COWBOY_BODY]: '/images/cowboy-body.png'
}

export const bundleManifest: ResolverManifest = {
	bundles: [
		{ name: Bundle.GAME_SCREEN, assets: gameBundleAssets }
	]
}