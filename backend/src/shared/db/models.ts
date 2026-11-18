import type { Sequelize } from 'sequelize';
import type { ModuleDefinition } from '../module';

let initialised = false;

/**
 * Model registration: initModels(sequelize) of every module, then associate() of every module
 * (associations need all models to exist). The module list comes from modules/registry.ts.
 */
export function initAllModels(sequelize: Sequelize, modules: readonly ModuleDefinition[]): void {
  if (initialised) return;
  for (const m of modules) m.models.initModels(sequelize);
  for (const m of modules) m.models.associate();
  initialised = true;
}
