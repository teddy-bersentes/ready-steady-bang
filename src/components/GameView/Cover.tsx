import clsx from "clsx"
import { motion } from "framer-motion"

type Props = {
	isEnabled: boolean
}

export function Cover({ isEnabled }: Props) {
	return (
		<motion.div
			className={clsx(
				'absolute w-screen h-[100svh] bg-cowboy-gray-50',
				isEnabled ? 'pointer-events-auto' : 'pointer-events-none'
			)}
			initial={{ opacity: 0 }}
			animate={{
				opacity: isEnabled ? 1 : 0,
				transition: { duration: 0.3 }
			}}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
		/>
	)
}