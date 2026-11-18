import type { ModuleContext, ModuleDefinition } from '../../shared/module';
import { router } from './teams.routes';
import * as models from './models';

// Public API of the `teams` module (owner P3, R10, R11, R12). Other modules may import ONLY
// from this file (enforced by the ESLint rule local/module-boundaries).
// TODO(R10, P3): export the public API listed in README.md.

function register(ctx: ModuleContext): void {
  ctx.router.use(router);
}

export const definition: ModuleDefinition = { name: 'teams', register, models };
