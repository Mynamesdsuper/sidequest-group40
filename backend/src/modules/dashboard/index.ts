import type { ModuleContext, ModuleDefinition } from '../../shared/module';
import { router } from './dashboard.routes';
import * as models from './models';

// Public API of the `dashboard` module (owner P2, R06). Other modules may import ONLY
// from this file (enforced by the ESLint rule local/module-boundaries).
// TODO(R06B, P2): export the public API listed in README.md.

function register(ctx: ModuleContext): void {
  ctx.router.use(router);
}

export const definition: ModuleDefinition = { name: 'dashboard', register, models };
