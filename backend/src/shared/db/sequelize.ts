import { Sequelize } from 'sequelize';
import { getConfig } from '../config';

let instance: Sequelize | undefined;

/** The single Sequelize instance (Singleton), created on first use: TEST_DATABASE_URL when NODE_ENV=test. */
export function getSequelize(): Sequelize {
  instance ??= new Sequelize(getConfig().dbUrl, {
    dialect: 'postgres',
    logging: false,
    define: { underscored: false, timestamps: true },
  });
  return instance;
}

/** True when the database answers (used by GET /health). */
export async function isDbUp(): Promise<boolean> {
  try {
    await getSequelize().authenticate();
    return true;
  } catch {
    return false;
  }
}

export async function closeDb(): Promise<void> {
  await instance?.close();
  instance = undefined;
}
