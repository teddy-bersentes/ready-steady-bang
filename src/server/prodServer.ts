import 'module-alias/register'
import { appRouter } from '~/server/routers/_app';
import { createTRPCContext } from '~/server/trpc';
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import http from 'http'
import next from 'next';
import { parse } from 'url';
import ws from 'ws'

const port = process.env.PORT ?? 3000
const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

void app
	.prepare()
	.then(() => {
		const server = http.createServer((req, res) => {
			const proto = req.headers['x-forwarded-proto']
			if (proto && proto === 'http') {
				res.writeHead(303, {
					// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
					location: `https://` + req.headers.host + (req.headers.url ?? ''),
				});
				res.end();
				return;
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-non-null-assertion
			const parsedUrl = parse(req.url!, true);
			void handle(req, res, parsedUrl)
		})


		const wss = new ws.Server({ server })
		const trpcHandler = applyWSSHandler({ wss, router: appRouter, createContext: createTRPCContext })

		process.on('SIGTERM', () => trpcHandler.broadcastReconnectNotification())
		server.listen(port)

		console.log(
			'⚡ Server listening on',
			`http://localhost:${port}`,
		)
	})