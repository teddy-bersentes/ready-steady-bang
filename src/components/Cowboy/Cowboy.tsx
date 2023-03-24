import { useRef, useMemo } from "react";
import { Transform } from "@pixi/math";
import { type PixiRef, type Sprite, useTick, Container, useApp } from "@pixi/react";
import type { CowboyStatus } from "~/lib/stores/game";
import { CowboyAnimationStart } from "./CowboyAnimationStart";
import { CowboyAnimationDrawing } from "./CowboyAnimationDrawing";
import { CowboyAnimationFiring } from "./CowboyAnimationFiring";
import { CowboyAnimationDead } from "./CowboyAnimationDead";
import { CowboyAnimationAfraid } from "./CowboyAnimationAfraid";

const ROTATION_LIMIT = 0.75

type SpriteRef = PixiRef<typeof Sprite>
type ContainerRef = PixiRef<typeof Container>
type Props = {
	status: CowboyStatus
	flipped?: boolean
	hidden?: boolean
}

export function Cowboy({ status, flipped, hidden }: Props) {
	const stage = useApp()
	const containerRef = useRef<ContainerRef>(null)
	const armRef = useRef<SpriteRef>(null)

	const transform = useMemo<Transform>(() => {
		const t = new Transform()

		if (flipped) {
			t.scale.x = 1
			t.scale.y = -1
			t.position.y = stage.screen.height
		}

		return t
	}, [flipped, stage.screen])

	useTick(() => {
		if (status === 'drawing' && armRef.current) {
			if (armRef.current.rotation > -ROTATION_LIMIT) {
				armRef.current.rotation -= 0.01
			}
		}

		if (containerRef.current && hidden) {
			containerRef.current.alpha -= 0.06
		}
	})


	return (
		<Container
			ref={containerRef}
			anchor={0.5}
			transform={transform}
		>
			{status === 'start' && <CowboyAnimationStart />}
			{status === 'drawing' && <CowboyAnimationDrawing ref={armRef} />}
			{status === 'firing' && <CowboyAnimationFiring />}
			{status === 'dead' && <CowboyAnimationDead />}
			{status === 'afraid' && <CowboyAnimationAfraid />}
		</Container>
	)
}