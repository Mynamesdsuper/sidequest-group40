import http from 'node:http';
import { createApp } from './app';
import { getConfig } from './shared/config';
import { closeDb } from './shared/db';
import { createSocketServer } from './shared/realtime/socket-server';

// Entry point: one HTTP server for both the REST API (Express) and Socket.IO.
const config = getConfig();
const httpServer = http.createServer();
const io = createSocketServer(httpServer, config.FRONTEND_ORIGIN);
httpServer.on('request', createApp({ io }));

httpServer.listen(config.PORT, () => {
  console.log(
    `SideQuest API on http://localhost:${config.PORT}/api/v1 (docs: /api/docs) [${config.NODE_ENV}]`,
  );
});

function shutdown(): void {
  io.close();
  httpServer.close(() => void closeDb().finally(() => process.exit(0)));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
