import { AnimatedSprite, useApp } from '@pixi/react'
import { useAnimation } from '~/utils/animations'

const SIZE = {
	width: 256,
	height: 256
}

export function CowboyAnimationFiring() {
	const stage = useApp()
	const textures = useAnimation('FIRE')

	return textures ? (
		<AnimatedSprite
			textures={textures}
			animationSpeed={0.4}
			isPlaying
			loop={false}
			x={(stage.screen.width / 2) - (SIZE.width / 2)}
			y={(stage.screen.height / 2) - (SIZE.height / 2)}
		/>
	) : null
}