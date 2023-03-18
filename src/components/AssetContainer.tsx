import { useEffect, useState, type ReactNode } from "react";
import { bundleManifest } from "~/lib/bundles";
import { Assets } from "@pixi/assets";

type Props = {
	children?: ReactNode;
}

export function AssetContainer({ children }: Props) {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		Assets.init({ manifest: bundleManifest })
			.finally(() => {
				setLoaded(true);
			});
	}, []);

	return loaded ? (
		<>
			{children}
		</>
	) : null
}