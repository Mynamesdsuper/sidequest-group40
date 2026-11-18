import type { MigrationContext } from '../../shared/db';

// Baseline: pgcrypto provides gen_random_uuid() for the UUID primary keys of every table.
export async function up({ context }: MigrationContext): Promise<void> {
  await context.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.sequelize.query('DROP EXTENSION IF EXISTS pgcrypto');
}
