import { useCallback, useEffect } from "react";

export const useSpaceBarListener = (callback: () => void) => {
	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		if (event.code === 'Space') {
			callback();
		}
	}, [callback]);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleKeyDown]);
}
