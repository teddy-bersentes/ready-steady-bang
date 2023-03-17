import { createTRPCContext } from './trpc';
import { appRouter } from './routers/_app';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws'
import chalk from 'chalk';

const wss = new ws.Server({ port: 3001 });
const trpcHandler = applyWSSHandler({ wss, router: appRouter, createContext: createTRPCContext });

wss.on('connection', (ws) => {
	console.log(
		chalk.yellow('[WS - Client]'),
		chalk.greenBright('Connected'),
		chalk.dim(`(${wss.clients.size} clients)`)
	);
	ws.on('close', () => console.log(
		chalk.yellow('[WS - Client]'),
		chalk.redBright('Disconnected'),
		chalk.dim(`(${wss.clients.size} clients)`)
	))
})

console.log(
	chalk.yellow('[WS - Client]'),
	'Listening on port 3001'
)

process.on('SIGTERM', () => {
	console.log(
		chalk.yellow('[WS - Server]'),
		chalk.redBright('Shutting down')
	)
	trpcHandler.broadcastReconnectNotification()
	wss.close()
})