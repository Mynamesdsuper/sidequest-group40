import type { MigrationContext } from '../../shared/db';

// Seed of the `missions` module. Runs on every db:seed / test reset, so it must be idempotent.
// TODO(R02, P1): insert the six categories of A-23 (docs/decisions/assumptions.md).
export async function up(_: MigrationContext): Promise<void> {}
