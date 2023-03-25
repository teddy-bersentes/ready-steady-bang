import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import useSound from "use-sound"
import clsx from "clsx"
import type { Duel } from "~/server/redis"
import Image from "next/image"
import bangImg from "../../../public/images/bang.png"
import { gameIsActive } from "~/utils/game"

type Props = {
	duel: Duel
}

export function TimerMarkers({ duel }: Props) {
	const { ready, steady, bang } = duel

	const [status, setStatus] = useState<'start' | 'ready' | 'steady' | 'bang'>('ready')
	const [readyVisible, setReadyVisible] = useState(false)
	const [steadyVisible, setSteadyVisible] = useState(false)

	// These should have already been loaded from `components/GameLoader.tsx` and `utils/sounds.ts`
	const [playReadySound] = useSound('/sounds/ready.mp3')
	const [playSteadySound] = useSound('/sounds/steady.mp3')
	const [playBangSound] = useSound('/sounds/bang.mp3')

	useEffect(() => {
		const readyDist = ready - Date.now()
		readyDist > 0 && setTimeout(() => {
			if (!gameIsActive()) return
			setStatus('ready')
			setReadyVisible(true)
			playReadySound()
		}, readyDist)

		const steadyDist = steady - Date.now()
		steadyDist > 0 && setTimeout(() => {
			if (!gameIsActive()) return
			setStatus('steady')
			setSteadyVisible(true)
			playSteadySound()
		}, steadyDist)

		const bangDist = bang - Date.now()
		bangDist > 0 && setTimeout(() => {
			if (!gameIsActive()) return
			setStatus('bang')
			playBangSound()
		}, bangDist)

	}, [ready, steady, bang, playReadySound, playSteadySound, playBangSound])

	useEffect(() => {
		if (!readyVisible) return
		setTimeout(() => setReadyVisible(false), 1000)
	}, [readyVisible])

	useEffect(() => {
		if (!steadyVisible) return
		setTimeout(() => setSteadyVisible(false), 1000)
	}, [steadyVisible])

	return (
		<div className='absolute w-20 h-20 flex flex-col items-center justify-center'>
			<AnimatePresence>
				{readyVisible && (
					<motion.h1
						key='ready'
						className='absolute tracking-wider text-center text-cowboy-gray-200'
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							transition: { duration: 0.2 }
						}}
						exit={{
							opacity: 0,
							transition: { duration: 0.3 }
						}}
					>
						ready
					</motion.h1>
				)}

				{steadyVisible && (
					<motion.h1
						key='steady'
						className='absolute tracking-wider text-center text-cowboy-gray-200'
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							transition: { duration: 0.2 }
						}}
						exit={{
							opacity: 0,
							transition: { duration: 0.3 }
						}}
					>
						steady
					</motion.h1>
				)}
			</AnimatePresence>

			<div className={clsx('absolute', status !== 'bang' && 'opacity-0')}>
				<Image
					style={{ zIndex: 20 }}
					priority
					src={bangImg}
					width={75}
					height={75}
					alt='bang!'
				/>
			</div>
		</div>
	)
}