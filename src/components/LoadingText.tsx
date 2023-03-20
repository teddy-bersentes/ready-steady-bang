import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function LoadingText() {
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
				}
			}}
			exit={{
				opacity: 0,
				y: 14
			}}
			transition={{ duration: 0.3 }}
			className='absolute flex flex-col justify-center items-center'
		>
			<p className='text-base tracking-wide text-cowboy-gray-600'>
				Loading<DotText />
			</p>
		</motion.div>
	)
}

function DotText() {
	const [text, setText] = useState<string>('')

	useEffect(() => {
		const id = setInterval(
			() => setText(prev => prev.length === 3 ? '' : prev + '.'),
			300
		)
		return () => clearInterval(id)
	}, [])

	return <span>{text}</span>
}
