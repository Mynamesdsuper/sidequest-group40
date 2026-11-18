import path from 'node:path';
import dotenv from 'dotenv';
import { v, type Infer } from '../validation';

// backend/.env, both from src/shared/config (tsx, ts-jest) and from dist/shared/config (node).
dotenv.config({ path: path.resolve(__dirname, '../../../.env'), quiet: true });

const schema = v.object({
  NODE_ENV: v.enum(['development', 'test', 'production'] as const),
  PORT: v.int({ min: 1, max: 65535 }),
  DATABASE_URL: v.string({ min: 1 }),
  TEST_DATABASE_URL: v.string({ min: 1 }).optional(),
  TOKEN_SECRET: v.string({ min: 8 }),
  TOKEN_EXPIRES_IN: v.string({ min: 1 }),
  FRONTEND_ORIGIN: v.string({ min: 1 }),
  UPLOAD_DIR: v.string({ min: 1 }),
  MAX_UPLOAD_MB: v.int({ min: 1, max: 50 }),
});

export type Config = Infer<typeof schema> & {
  /** The database the app actually uses: TEST_DATABASE_URL when NODE_ENV=test. */
  dbUrl: string;
};

/** Checks the environment with the shared Validator and fails at boot with a readable message. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const r = schema.validate(env);
  const problems = r.ok ? [] : r.errors.map((e) => `${e.path}: ${e.message}`);
  if (r.ok && r.value.NODE_ENV === 'test' && !r.value.TEST_DATABASE_URL) {
    problems.push('TEST_DATABASE_URL: is required when NODE_ENV=test');
  }
  if (r.ok && r.value.NODE_ENV === 'production' && r.value.TOKEN_SECRET === 'change-me') {
    problems.push('TOKEN_SECRET: must be changed in production');
  }
  if (!r.ok || problems.length) {
    throw new Error(
      `Invalid environment configuration (see backend/.env.example):\n  - ${problems.join('\n  - ')}`,
    );
  }
  const c = r.value;
  return { ...c, dbUrl: c.NODE_ENV === 'test' ? (c.TEST_DATABASE_URL as string) : c.DATABASE_URL };
}

let cached: Config | undefined;
export function getConfig(): Config {
  cached ??= loadConfig();
  return cached;
}
