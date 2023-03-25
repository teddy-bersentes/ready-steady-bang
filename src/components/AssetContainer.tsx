import { useEffect, useState, type ReactNode } from "react";
import { bundleManifest } from "~/utils/assets";
import { Assets } from "@pixi/assets"
import { spritesheetAsset } from '@pixi/spritesheet'
import { extensions } from "@pixi/extensions"

type Props = {
	children?: ReactNode;
}

export function AssetContainer({ children }: Props) {
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		extensions.add(spritesheetAsset);
		Assets.init({ manifest: bundleManifest })
			.finally(() => setLoaded(true))
	}, []);

	return loaded ? <>{children}</> : null
}