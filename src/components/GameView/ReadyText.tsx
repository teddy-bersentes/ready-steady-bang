import { motion } from "framer-motion"
import { Dots } from "~/components/Dots"

export function ReadyText() {
	return (
		<motion.p
			className='absolute text-cowboy-gray-400 select-none'
			initial={{ opacity: 0 }}
			animate={{
				opacity: 1,
				transition: { delay: 0.3 }
			}}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
			Waiting for opponent<Dots />
		</motion.p>
	)
}