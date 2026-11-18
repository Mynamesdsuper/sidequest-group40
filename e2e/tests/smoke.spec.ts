import { expect, test } from '@playwright/test';
import { apiContext, getJson, type Health } from '../fixtures/api';
import { setServerClockOffset } from '../fixtures/clock';

// Proves the whole chain works: browser → frontend → backend → database, plus the test-only endpoints.

test('the health API answers with the database up', async () => {
  const api = await apiContext();
  const health = await getJson<Health>(api, 'health');
  expect(health).toMatchObject({ status: 'ok', db: 'up' });
  await api.dispose();
});

test('the home page shows the backend status', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('backend ok', { exact: false })).toBeVisible();
});

test('the server clock can be moved and restored', async () => {
  try {
    const moved = await setServerClockOffset(3600);
    expect(moved.offsetSeconds).toBe(3600);
    expect(Date.parse(moved.now) - Date.now()).toBeGreaterThan(3500 * 1000);
  } finally {
    // Restore real time even when an assertion fails, so later tests are not shifted.
    expect((await setServerClockOffset(0)).offsetSeconds).toBe(0);
  }
});
