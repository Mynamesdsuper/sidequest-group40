import cors from 'cors';
import express, { Router } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import type { Server as SocketServer } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import { modules } from './modules/registry';
import { clock } from './shared/clock';
import { getConfig } from './shared/config';
import { getSequelize, initAllModels, isDbUp } from './shared/db';
import { errorHandler, notFoundHandler } from './shared/errors';
import { eventBus } from './shared/events';
import type { ModuleContext } from './shared/module';
import { loadOpenApi } from './shared/openapi/merge';
import { bindPort, getPort } from './shared/ports';
import { createTestRouter } from './shared/testing/test-router';

export interface AppOptions {
  /** The Socket.IO server (server.ts); null when tests build the app without an HTTP server. */
  io?: SocketServer | null;
}

/** Builds the Express app: middleware stack, /api/v1 with every module, API docs, 404 and error handler. */
export function createApp({ io = null }: AppOptions = {}): express.Express {
  const config = getConfig();
  const openApi = loadOpenApi(); // fails at boot if two modules declare the same path or schema

  initAllModels(getSequelize(), modules);

  const app = express();
  app.use(helmet());
  app.use(cors({ origin: config.FRONTEND_ORIGIN }));
  app.use(express.json({ limit: '1mb' }));
  if (config.NODE_ENV !== 'test') app.use(morgan('dev'));

  const api = Router();
  api.get('/health', async (_req, res) => {
    res.json({ status: 'ok', db: (await isDbUp()) ? 'up' : 'down', time: clock.now().toISOString() });
  });
  if (config.NODE_ENV === 'test') api.use(createTestRouter(clock));

  const ctx: ModuleContext = { router: api, io, bus: eventBus, clock, ports: { bindPort, getPort } };
  for (const m of modules) m.register(ctx);

  app.use('/api/v1', api);
  app.get('/api/docs.json', (_req, res) => {
    res.json(openApi);
  });
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApi));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
