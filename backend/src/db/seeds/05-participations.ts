import type { MigrationContext } from '../../shared/db';

// Seed of the `participations` module. Runs on every db:seed / test reset, so it must be idempotent.
// TODO(R04, P2): insert the demo data (see the demo accounts in docs/design/scaffold-spec.md §7.6).
export async function up(_: MigrationContext): Promise<void> {}
