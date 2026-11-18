import type { Router } from 'express';
import type { Sequelize } from 'sequelize';
import type { Server as SocketServer } from 'socket.io';
import type { Clock } from './clock';
import type { EventBus } from './events';
import type { bindPort, getPort } from './ports';

/** What app.ts hands to every module in register(ctx). */
export interface ModuleContext {
  /** Router mounted at /api/v1: the module adds its routes with their full paths. */
  router: Router;
  /** The Socket.IO server; null in tests that build the app without an HTTP server. */
  io: SocketServer | null;
  bus: EventBus;
  clock: Clock;
  ports: { bindPort: typeof bindPort; getPort: typeof getPort };
}

export interface ModuleModels {
  initModels(sequelize: Sequelize): void;
  associate(): void;
}

/** Each module exports one of these from its index.ts; modules/registry.ts lists them. */
export interface ModuleDefinition {
  name: string;
  register(ctx: ModuleContext): void;
  models: ModuleModels;
}
