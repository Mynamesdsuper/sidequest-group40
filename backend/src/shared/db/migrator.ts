import path from 'node:path';
import type { QueryInterface } from 'sequelize';
import { Umzug, SequelizeStorage, memoryStorage } from 'umzug';
import { getSequelize } from './sequelize';

// Versioned migrations with Umzug (ADR 0006: not sequelize.sync(), so every schema change is a
// reviewed, ordered file). Files: src/db/migrations/YYYYMMDDHHmm-<module>-<description>.ts,
// each exporting up({ context }) and down({ context }) where context is the QueryInterface.

export type MigrationContext = { context: QueryInterface };

const DB_DIR = path.resolve(__dirname, '../../db');
// .ts when run with tsx / ts-jest, .js after `npm run build`.
const files = (dir: string): [string, { cwd: string; ignore: string[] }] => [
  '*.{ts,js}',
  { cwd: path.join(DB_DIR, dir), ignore: ['*.d.ts'] },
];

export function createMigrator() {
  const sequelize = getSequelize();
  return new Umzug({
    migrations: {
      glob: files('migrations'),
      // Recorded without the extension, so tsx (.ts) and the built image (.js) see the same migration.
      resolve: (params) => ({
        ...Umzug.defaultResolver(params),
        name: params.name.replace(/\.(ts|js)$/, ''),
      }),
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeMeta' }),
    logger: undefined,
  });
}

/** Seeds are not recorded: they all run every time, in file order (01-users … 07-notifications), so they must be idempotent. */
export function createSeeder() {
  return new Umzug({
    migrations: { glob: files('seeds') },
    context: getSequelize().getQueryInterface(),
    storage: memoryStorage(),
    logger: undefined,
  });
}

/** Empties every application table (keeps the migration log). Used by db:reset in tests and by the test router. */
export async function truncateAll(): Promise<void> {
  const sequelize = getSequelize();
  const [rows] = await sequelize.query(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> 'SequelizeMeta'`,
  );
  const tables = (rows as { tablename: string }[]).map((r) => `"${r.tablename}"`);
  if (tables.length) await sequelize.query(`TRUNCATE ${tables.join(', ')} RESTART IDENTITY CASCADE`);
}

/** Test database back to a known state: empty tables, then the seeds. */
export async function resetDatabase(): Promise<void> {
  await truncateAll();
  await createSeeder().up();
}
