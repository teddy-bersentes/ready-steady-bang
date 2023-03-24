import { AnimatedSprite, useApp } from '@pixi/react'
import { useAnimation } from '~/utils/animations'

const COWBOY_SIZE = {
	width: 300,
	height: 125
}

const BLOOD_SPLAT_SIZE = {
	width: 78,
	height: 77
}

export function CowboyAnimationDead() {
	const stage = useApp()
	const dyingCowboyAnimation = useAnimation('DEATH')
	const bloodSplatAnimation = useAnimation('BLOOD')

	return (dyingCowboyAnimation && bloodSplatAnimation) ? (
		<>
			<AnimatedSprite
				name='blood-splat'
				textures={bloodSplatAnimation}
				animationSpeed={0.4}
				isPlaying
				x={(stage.screen.width / 2) - (BLOOD_SPLAT_SIZE.width / 2)}
				y={(stage.screen.height / 2) - (BLOOD_SPLAT_SIZE.height / 2)}
				scale={0.8}
				loop={false}
				zIndex={1}
			/>

			<AnimatedSprite
				name='dying-cowboy'
				textures={dyingCowboyAnimation}
				animationSpeed={0.4}
				isPlaying
				x={(stage.screen.width / 2) - (COWBOY_SIZE.width / 2)}
				y={(stage.screen.height / 2) - (COWBOY_SIZE.height / 2)}
				loop={false}
				zIndex={2}
			/>
		</>
	) : null
}