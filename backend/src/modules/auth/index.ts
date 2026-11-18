import type { ModuleContext, ModuleDefinition } from '../../shared/module';
import { router } from './auth.routes';
import * as models from './models';

// Public API of the `auth` module (owner P1, R01). Other modules may import ONLY
// from this file (enforced by the ESLint rule local/module-boundaries).
// TODO(R01, P1): export the public API listed in README.md.

function register(ctx: ModuleContext): void {
  ctx.router.use(router);
}

export const definition: ModuleDefinition = { name: 'auth', register, models };
