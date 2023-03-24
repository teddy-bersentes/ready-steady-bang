import { motion } from "framer-motion";
import { Button } from "~/components/Button";

type Props = {
	onReady: () => void
}

export function IdleText({ onReady }: Props) {
	return (
		<>
			<motion.div
				key='button'
				className='absolute'
				initial={{ opacity: 0 }}
				animate={{
					opacity: 1,
					transition: { delay: 0.3 }
				}}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}
			>
				<Button onClick={onReady}>
					READY
				</Button>
			</motion.div>

			<motion.p
				key='text'
				className='absolute text-cowboy-gray-400 bottom-8 min-[500px]:visible invisible'
				initial={{ opacity: 0 }}
				animate={{
					opacity: 1,
					transition: { delay: 0.3 }
				}}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}
			>
				press space to ready up
			</motion.p>
		</>
	)
}