import type { Spritesheet } from '@pixi/spritesheet'
import type { Texture, Resource } from '@pixi/core'

type Params = {
	animationName: string,
	spritesheet: Spritesheet
}

export const getFrames = ({ animationName, spritesheet }: Params): Texture<Resource>[] => {
	const sequence = spritesheet.animations[animationName]
	if (!sequence) throw new Error('No animation found on spritesheet with name: ' + animationName)
	return sequence
}