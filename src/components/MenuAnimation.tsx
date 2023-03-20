import { useState, useEffect, useCallback } from 'react'
import type { Texture, Resource } from '@pixi/core'
import { useApp, AnimatedSprite, Sprite } from '@pixi/react'
import { Assets } from '@pixi/assets'
import type { Spritesheet } from '@pixi/spritesheet'
import { getFrames } from '~/utils/frames'

export function MenuAnimation() {
	const stage = useApp()
	const [previewAsset, setPreviewAsset] = useState<Texture | null>(null)
	const [menuAnimation, setMenuAnimation] = useState<Texture<Resource>[] | null>(null)

	const loadAllAssets = useCallback(async () => {
		const previewAsset = await Assets.load<Texture>('/images/menu_preview.png')
		setPreviewAsset(previewAsset)

		const spritesheet = await Assets.load<Spritesheet>('/animations/menu.json')
		const frames = getFrames({ animationName: 'menu', spritesheet })
		setMenuAnimation(frames)

		stage.ticker?.start()
	}, [stage])

	useEffect(() => {
		loadAllAssets()
			.catch(console.error)
	}, [loadAllAssets])


	return (
		<>
			{previewAsset && menuAnimation === null && (
				<Sprite
					texture={previewAsset}
					scale={0.5}
					x={(375 / 2) - (previewAsset.width / 4)}
					y={0}
				/>
			)}

			{previewAsset && menuAnimation && (
				<AnimatedSprite
					textures={menuAnimation}
					name='menu'
					scale={0.5}
					x={(375 / 2) - (previewAsset.width / 4)}
					y={0}
					animationSpeed={22 / 60}
					isPlaying
					loop={false}
				/>
			)}
		</>
	)
}