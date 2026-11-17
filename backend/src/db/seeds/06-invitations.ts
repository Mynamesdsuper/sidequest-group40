import type { MigrationContext } from '../../shared/db';

// Seed of the `invitations` module. Runs on every db:seed / test reset, so it must be idempotent.
// TODO(R08, P3): insert the demo data (see the demo accounts in docs/design/scaffold-spec.md §7.6).
export async function up(_: MigrationContext): Promise<void> {}
