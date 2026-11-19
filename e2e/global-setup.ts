import { request } from '@playwright/test';
import { API_URL } from './fixtures/api';

// Runs once before all tests: empties the test database, re-runs the seeds and sets the clock offset to 0.
export default async function globalSetup(): Promise<void> {
  const api = await request.newContext({ baseURL: API_URL });
  const res = await api.post('/api/v1/__test__/reset');
  if (res.status() !== 204) {
    throw new Error(
      `POST /api/v1/__test__/reset answered ${res.status()}: is the backend running with NODE_ENV=test?`,
    );
  }
  await api.dispose();
}
