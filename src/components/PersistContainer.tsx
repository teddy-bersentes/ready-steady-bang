import { type ReactNode, useState, useEffect } from "react";
import { useUserStore } from "~/lib/stores/user";

type Props = {
	children?: ReactNode;
}

export function PersistContainer({ children }: Props) {
	const [hydrated, setHydrated] = useState(useUserStore.persist.hasHydrated);

	useEffect(() => {
		const unsubscribe = useUserStore.persist.onFinishHydration(() => setHydrated(true))
		setHydrated(useUserStore.persist.hasHydrated())
		return unsubscribe
	}, [])

	return hydrated ? (
		<>
			{children}
		</>
	) : null
}