import type { MigrationContext } from '../../shared/db';

// Seed of the `notifications` module. Runs on every db:seed / test reset, so it must be idempotent.
// TODO(R06A, P2): insert the demo data (see the demo accounts in docs/design/scaffold-spec.md §7.6).
export async function up(_: MigrationContext): Promise<void> {}
