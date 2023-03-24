import { forwardRef } from 'react'
import { type PixiRef, Sprite, useApp } from '@pixi/react'
import { useTexture } from '~/utils/animations'

type SpriteRef = PixiRef<typeof Sprite>

// The offset of the arm from the center of the body
const ARM_OFFSET = {
	x: 20,
	y: 18
}

/*
 * This component is meant to hide the loading time of the `fire` mutation sent to the server.
 * In `Cowboy.tsx` there is a `useTick` hook that rotates the arm of the cowboy slowly, up to
 * a certain point. The animation will skip to a shooting animation once the request is sent.
*/
export const CowboyAnimationDrawing = forwardRef<SpriteRef>(function Anim(_props, ref) {
	const stage = useApp()
	const armTexture = useTexture('COWBOY_ARM')
	const bodyTexture = useTexture('COWBOY_BODY')


	return (armTexture && bodyTexture) ? (
		<>
			<Sprite
				name='arm'
				ref={ref}
				texture={armTexture}
				anchor={0.5}
				x={(stage.screen.width / 2) - (armTexture.width / 2) + ARM_OFFSET.x}
				y={(stage.screen.height / 2) - (armTexture.height / 2) + ARM_OFFSET.y}
			/>

			<Sprite
				name='body'
				texture={bodyTexture}
				x={(stage.screen.width / 2) - (bodyTexture.width / 2)}
			/>
		</>
	) : null
})