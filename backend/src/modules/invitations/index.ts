import type { ModuleContext, ModuleDefinition } from '../../shared/module';
import { router } from './invitations.routes';
import * as models from './models';

// Public API of the `invitations` module (owner P3, R08). Other modules may import ONLY
// from this file (enforced by the ESLint rule local/module-boundaries).
// TODO(R08, P3): export the public API listed in README.md.

function register(ctx: ModuleContext): void {
  ctx.router.use(router);
}

export const definition: ModuleDefinition = { name: 'invitations', register, models };
