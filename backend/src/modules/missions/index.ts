import type { ModuleContext, ModuleDefinition } from '../../shared/module';
import { router } from './missions.routes';
import * as models from './models';

// Public API of the `missions` module (owner P1, R02, R03, R07). Other modules may import ONLY
// from this file (enforced by the ESLint rule local/module-boundaries).
// TODO(R02, P1): export the public API listed in README.md.

function register(ctx: ModuleContext): void {
  ctx.router.use(router);
}

export const definition: ModuleDefinition = { name: 'missions', register, models };
