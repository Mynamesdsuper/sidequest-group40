import type { ModuleContext, ModuleDefinition } from '../../shared/module';
import { router } from './notifications.routes';
import * as models from './models';

// Public API of the `notifications` module (owner P2, R06). Other modules may import ONLY
// from this file (enforced by the ESLint rule local/module-boundaries).
// TODO(R06A, P2): export the public API listed in README.md.

function register(ctx: ModuleContext): void {
  ctx.router.use(router);
}

export const definition: ModuleDefinition = { name: 'notifications', register, models };
