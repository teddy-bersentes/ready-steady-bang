import React from "react";
import clsx, { type ClassValue } from "clsx";

type Props = { className?: ClassValue } & Omit<React.ComponentPropsWithoutRef<"button">, 'onMouseDown' | 'onMouseUp' | 'onMouseLeave'>
export function Button({ className, children, ...props }: Props) {
	const [isPressed, setIsPressed] = React.useState(false);

	return (
		<button
			className={clsx(
				'bg-cowboy-gray-850 rounded-lg cursor-pointer disabled:opacity-60 outline-none',
				isPressed ? 'pb-1' : 'pb-2',
				isPressed ? 'mt-2' : 'mt-1',
				className
			)}
			onMouseDown={() => setIsPressed(true)}
			onMouseUp={() => setIsPressed(false)}
			onMouseLeave={() => setIsPressed(false)}
			{...props}
		>
			{/* We take 4px off the right because of a slight offset caused by the fonts  */}
			<div className='w-full h-full px-5 py-3 pr-4 font-medium text-white rounded-lg select-none bg-cowboy-gray-650'>
				{children}
			</div>
		</button>
	)
}