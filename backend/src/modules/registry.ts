import type { ModuleDefinition } from '../shared/module';
import { definition as auth } from './auth';
import { definition as users } from './users';
import { definition as missions } from './missions';
import { definition as participations } from './participations';
import { definition as notifications } from './notifications';
import { definition as dashboard } from './dashboard';
import { definition as invitations } from './invitations';
import { definition as teams } from './teams';

/**
 * All 8 modules in a fixed order (models are initialised and routes registered in this order).
 * Written once in the scaffold: nobody needs to edit it later.
 */
export const modules: readonly ModuleDefinition[] = [
  auth,
  users,
  missions,
  participations,
  notifications,
  dashboard,
  invitations,
  teams,
];
