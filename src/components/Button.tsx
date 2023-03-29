import { type ReactNode, type ComponentPropsWithoutRef, forwardRef, useCallback } from "react";
import clsx, { type ClassValue } from "clsx";
import Link, { type LinkProps } from "next/link";

type BaseProps = {
	className?: ClassValue
	children?: ReactNode
	href?: string
	disabled?: boolean
	onClick?: () => void
}

type DivProps = Omit<ComponentPropsWithoutRef<'div'>, 'className'>
type AnchorProps = Omit<LinkProps, 'className' | 'href'>

type Props = BaseProps & (AnchorProps | DivProps)

export const Button = forwardRef<HTMLAnchorElement, Props>(
	function Button({ className, href, children, disabled, onClick, ...props }, ref) {
		className = clsx(
			'cursor-pointer group relative flex justify-center items-center',
			disabled && 'cursor-not-allowed opacity-50',
			className
		)

		const _onClick = useCallback(() => {
			if (disabled) return
			onClick && onClick()
		}, [disabled, onClick])

		return href === undefined ? (
			<div
				className={className}
				onClick={_onClick}
				{...props as DivProps}
			>
				<InnerContent disabled={disabled}>
					{children}
				</InnerContent>
			</div>
		) : (
			<Link ref={ref} href={href} className={className} {...props as AnchorProps}>
				<InnerContent>
					{children}
				</InnerContent>
			</Link>
		)
	}
)

type InnerContentProps = {
	children?: ReactNode
	disabled?: boolean
}
function InnerContent({ children, disabled }: InnerContentProps) {
	return (
		<>
			<div className='bg-cowboy-gray-850 w-full h-full absolute rounded-lg translate-y-1.5' />
			<div className={clsx(
				'bg-cowboy-gray-650 z-10 flex px-5 py-3 rounded-lg transition-transform select-none text-white font-medium',
				!disabled && 'group-active:translate-y-1.5'
			)}>
				{children}
			</div>
		</>
	)
}