import type { ModuleContext, ModuleDefinition } from '../../shared/module';
import { router } from './participations.routes';
import * as models from './models';

// Public API of the `participations` module (owner P2, R04, R05, R09). Other modules may import ONLY
// from this file (enforced by the ESLint rule local/module-boundaries).
// TODO(R04, P2): export the public API listed in README.md.

function register(ctx: ModuleContext): void {
  ctx.router.use(router);
}

export const definition: ModuleDefinition = { name: 'participations', register, models };
