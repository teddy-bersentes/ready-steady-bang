import { motion } from "framer-motion";
import { Dots } from "~/components/Dots";

type Props = {
	delay?: number
}

export function LoadingText({ delay }: Props) {
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
			transition={{
				duration: 0.3,
				delay
			}}
			className='absolute flex flex-col justify-center items-center'
		>
			<p className='text-base tracking-wide text-cowboy-gray-600'>
				Loading<Dots />
			</p>
		</motion.div>
	)
}