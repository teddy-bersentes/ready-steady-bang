import { useState, useEffect, useCallback } from 'react'
import type { Spritesheet } from '@pixi/spritesheet'
import type { Texture, Resource } from '@pixi/core'
import { AnimationName, TextureName } from './assets'
import { Assets } from '@pixi/assets'

type GetFramesParams = {
	animationName: string,
	spritesheet: Spritesheet
}

export const getFrames = ({ animationName, spritesheet }: GetFramesParams): Texture<Resource>[] => {
	const sequence = spritesheet.animations[animationName]
	if (!sequence) throw new Error('No animation found on spritesheet with name: ' + animationName)
	return sequence
}


export const useAnimation = (animationKey: keyof typeof AnimationName): Texture<Resource>[] | null => {
	const [frames, setFrames] = useState<Texture<Resource>[] | null>(null)

	const loadAnimation = useCallback(() => {
		const animationName = AnimationName[animationKey]
		const spritesheet = Assets.get<Spritesheet>(animationName)
		const frames = getFrames({ animationName, spritesheet })
		setFrames(frames)
	}, [animationKey])

	useEffect(() => {
		loadAnimation()
	}, [loadAnimation])

	return frames
}

export const useTexture = (textureKey: keyof typeof TextureName): Texture<Resource> | null => {
	const [texture, setTexture] = useState<Texture<Resource> | null>(null)

	const loadTexture = useCallback(() => {
		const textureName = TextureName[textureKey]
		const texture = Assets.get<Texture<Resource>>(textureName)
		setTexture(texture)
	}, [textureKey])

	useEffect(() => {
		loadTexture()
	}, [loadTexture])

	return texture
}
