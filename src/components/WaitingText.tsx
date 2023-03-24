import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export function WaitingText() {

	const onCopyButton = async () => {
		await navigator.clipboard.writeText(window.location.href)
		toast.success('Copied link to clipboard')
	}

	return (
		<motion.div
			initial={{
				opacity: 0,
				y: -14,
			}}
			animate={{
				opacity: 1,
				y: 0,
				transition: {
					duration: 0.3,
					delay: 0.25
				}
			}}
			exit={{
				opacity: 0,
				y: 14
			}}
			transition={{ duration: 0.3 }}
			className='absolute flex flex-col justify-center items-center gap-2'
		>
			<p className='text-base tracking-wide text-cowboy-gray-600 animate-pulse'>
				Waiting for another players
			</p>

			<button className='hover:text-cowboy-gray-800 transition-colors p-1' onClick={onCopyButton}>
				Copy link
			</button>
		</motion.div>
	)
}