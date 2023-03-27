import { type AppProps } from "next/app";
import { trpc } from "~/utils/trpc";
import { uniFont } from "~/utils/fonts";
import clsx from 'clsx'
import "~/styles/globals.css";
import Head from "next/head";
import { AssetContainer } from "~/components/AssetContainer";
import { PersistContainer } from "~/components/PersistContainer";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<main className={clsx(uniFont.className, 'bg-cowboy-gray-50 antialiased text-cowboy-black-200')}>
			<Head>
				<title>ready steady bang</title>
				<meta name="description" content="See who's the fastest gun in the west" />
				<meta itemProp="name" content="ready steady bang" />
				<meta itemProp="description" content="See who's the fastest gun in the west" />
				<meta itemProp="image" content="https://ucarecdn.com/4ff39193-0ebd-4ff0-9a83-982a1a7f220e/og.png" />

				<meta property="og:url" content="https://ready-steady-bang.onrender.com/" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="ready steady bang" />
				<meta property="og:description" content="See who's the fastest gun in the west" />
				<meta property="og:image" content="https://ucarecdn.com/4ff39193-0ebd-4ff0-9a83-982a1a7f220e/og.png" />

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="ready steady bang" />
				<meta name="twitter:description" content="See who's the fastest gun in the west" />
				<meta name="twitter:image" content="https://ucarecdn.com/4ff39193-0ebd-4ff0-9a83-982a1a7f220e/og.png" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<AssetContainer>
				<PersistContainer>
					<Component {...pageProps} />
				</PersistContainer>
			</AssetContainer>
		</main>
	)
}

export default trpc.withTRPC(MyApp);
