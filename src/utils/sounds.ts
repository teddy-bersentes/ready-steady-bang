import useSound from "use-sound";
import { useState, useEffect } from "react";

type Params = () => void;

// A utility hook to run a callback when all sounds are loaded
export const useSoundLoader = (onLoad: Params) => {
	const [loadedKeys, setLoadedKeys] = useState<string[]>([]);

	useSound("/sounds/ready.mp3", {
		onload: () => setLoadedKeys((keys) => [...keys, "ready"])
	})

	useSound("/sounds/steady.mp3", {
		onload: () => setLoadedKeys((keys) => [...keys, "steady"])
	})

	useSound("/sounds/bang.mp3", {
		onload: () => setLoadedKeys((keys) => [...keys, "bang"])
	})

	useEffect(() => {
		if (loadedKeys.length === 3) {
			onLoad();
		}
	}, [loadedKeys, onLoad])
}