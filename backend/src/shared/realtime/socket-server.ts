import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';

/**
 * Creates the Socket.IO server on the same HTTP server as the REST API and hands it to the modules
 * through the module context. No authentication and no handlers here.
 * TODO(R06A, P2): JWT handshake (auth.token) and the RealtimePort binding live in the notifications module.
 */
export function createSocketServer(httpServer: HttpServer, frontendOrigin: string): Server {
  return new Server(httpServer, { cors: { origin: frontendOrigin } });
}
