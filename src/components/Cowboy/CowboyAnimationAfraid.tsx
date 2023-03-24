import { useState } from 'react'
import { AnimatedSprite, useApp } from '@pixi/react'
import { useAnimation } from '~/utils/animations'

const SIZE = {
	width: 800,
	height: 300
}

export function CowboyAnimationAfraid() {
	const stage = useApp()
	const startAnimation = useAnimation('FEAR_START')
	const loopAnimation = useAnimation('FEAR_LOOP')
	const [part, setPart] = useState<'start' | 'loop'>('start')

	return (startAnimation && loopAnimation) ? (
		<>
			{part === 'start' && (
				<AnimatedSprite
					name='fear-start'
					textures={startAnimation}
					animationSpeed={0.4}
					isPlaying
					x={(stage.screen.width / 2) - (SIZE.width / 2)}
					y={(stage.screen.height / 2) - (SIZE.height / 2)}
					loop={false}
					onComplete={() => setPart('loop')}
				/>
			)}

			{part === 'loop' && (
				<AnimatedSprite
					name='fear-loop'
					textures={loopAnimation}
					animationSpeed={0.4}
					isPlaying
					x={(stage.screen.width / 2) - (SIZE.width / 2)}
					y={(stage.screen.height / 2) - (SIZE.height / 2)}
					loop={true}
				/>
			)}
		</>
	) : null
}