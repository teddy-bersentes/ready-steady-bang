import { motion } from "framer-motion";
import { Dots } from "~/components/Dots";

export function LoadingText() {
	return (
		<motion.div
			initial={{
				y: -14,
				opacity: 0,
			}}
			animate={{
				y: 0,
				opacity: 1,
				transition: {
					duration: 0.3,
				}
			}}
			exit={{
				y: 14,
				opacity: 0
			}}
			transition={{ duration: 0.3 }}
			className='absolute flex flex-col justify-center items-center'
		>
			<p className='text-base tracking-wide text-cowboy-gray-600'>
				Loading<Dots />
			</p>
		</motion.div>
	)
}