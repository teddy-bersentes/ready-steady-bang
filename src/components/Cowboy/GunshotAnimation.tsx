import { AnimatedSprite, useApp } from '@pixi/react'
import { useAnimation } from '~/utils/animations'

const SIZE = {
	width: 100,
	height: 100
}

// The offset is to make it so the gunshot isn't centered on the cowboy.
const OFFSET = {
	x: 80,
	y: 32
}

export function GunshotAnimation() {
	const stage = useApp()
	const textures = useAnimation('BULLET_HOLE')

	return textures ? (
		<AnimatedSprite
			textures={textures}
			animationSpeed={0.4}
			isPlaying
			loop={false}
			x={(stage.screen.width / 2) - (SIZE.width / 2) - OFFSET.x}
			y={(stage.screen.height / 2) - (SIZE.height / 2) - OFFSET.y}
		/>
	) : null
}