import { Fragment, useMemo, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { randomWesternUsername } from "~/utils/names";
import { useUserStore } from "~/lib/stores/user";
import { Button } from "~/components/Button";
import { uniFont } from "~/utils/fonts";
import { trpc } from "~/utils/trpc";

type Props = {
	isOpen: boolean
	onClose: () => void
	onSubmit?: () => void
}

export function RegisterPopup({ isOpen, onClose: closeModal, onSubmit }: Props) {
	const input = useRef<HTMLInputElement>(null)
	const setUserId = useUserStore(state => state.setUserId)
	const [username, setUsername] = useState(randomWesternUsername())

	const { mutate: create, status } = trpc.user.register.useMutation({
		onSuccess: data => {
			setUserId(data.id)
			onSubmit && onSubmit()
			// The subscription can close the modal alternatively to the onSubmit callback
		}
	})

	const isDisabled = useMemo<boolean>(() => {
		return username.length < 1 || username.length > 50 || status === 'loading' || !isOpen
	}, [username, status, isOpen])

	const onRetry = () => {
		setUsername(randomWesternUsername())
		input.current?.focus()
	}

	const onComplete = () => {
		create({ name: username })
	}

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className={`relative z-10 ${uniFont.className}`} onClose={closeModal}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex items-center justify-center min-h-full p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
								<Dialog.Title as="h3" className="text-lg font-medium leading-6">
									Who are you?
								</Dialog.Title>
								<p className="mt-2 text-md text-cowboy-gray-650">
									To start beating other cowboys, you need to tell us who you are!
								</p>

								<div className='flex items-center gap-3'>
									<input
										ref={input}
										className='px-5 my-3 rounded-md outline-none grow h-11 bg-cowboy-gray-75 focus:outline-cowboy-gray-300 outline-dashed'
										autoFocus
										value={username}
										onChange={e => setUsername(e.target.value)}
									/>

									<button className='p-2 transition-colors rounded-full hover:bg-cowboy-gray-75 active:bg-cowboy-gray-100' onClick={onRetry}>
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='text-cowboy-gray-600'>
											<path d="M20 6V5H19V4H18V3H8V4H7V5H6V6H5V5V4H3V10H9V8H7V7H8V6H9V5H16V6H17V7H18V8H19V16H18V17H17V18H16V19H9V18H8V17H7V16H6V15H4V18H5V19H6V20H7V21H18V20H19V19H20V18H21V6H20Z" fill="currentColor" />
										</svg>
									</button>
								</div>

								<div className='mt-2 w-full'>
									<Button disabled={isDisabled} onClick={onComplete}>
										continue
									</Button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}