// Database commands (npm run db:migrate | db:migrate:undo | db:seed | db:reset).
import { getConfig } from '../shared/config';
import { closeDb, createMigrator, createSeeder, getSequelize } from '../shared/db';

async function main(command: string | undefined): Promise<void> {
  const config = getConfig();
  const migrator = createMigrator();
  switch (command) {
    case 'migrate': {
      const done = await migrator.up();
      console.log(
        `Migrations applied: ${done.length ? done.map((m) => m.name).join(', ') : 'none (up to date)'}`,
      );
      break;
    }
    case 'undo': {
      const undone = await migrator.down();
      console.log(`Migration undone: ${undone.map((m) => m.name).join(', ') || 'none'}`);
      break;
    }
    case 'seed': {
      const seeds = await createSeeder().up();
      console.log(`Seeds run: ${seeds.map((s) => s.name).join(', ')}`);
      break;
    }
    case 'reset': {
      if (config.NODE_ENV === 'production')
        throw new Error('db:reset refuses to run when NODE_ENV=production');
      // From scratch: drop every table (and the migration log), then migrate and seed.
      await getSequelize().getQueryInterface().dropAllTables();
      const done = await migrator.up();
      const seeds = await createSeeder().up();
      console.log(`Database reset: ${done.length} migration(s), ${seeds.length} seed(s)`);
      break;
    }
    default:
      throw new Error('Usage: tsx src/db/cli.ts migrate | undo | seed | reset');
  }
}

main(process.argv[2])
  .catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
