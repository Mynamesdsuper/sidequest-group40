import { Router } from 'express';
import { OffsetClock, type Clock } from '../clock';
import { resetDatabase } from '../db';
import { validate, validated, v } from '../validation';

/**
 * Test-only endpoints, mounted by app.ts ONLY when NODE_ENV=test (an integration test proves it is
 * absent otherwise). Used by the E2E global setup and by tests that move the server clock.
 */
export function createTestRouter(clock: Clock): Router {
  const router = Router();

  router.post('/__test__/reset', async (_req, res) => {
    await resetDatabase();
    if (clock instanceof OffsetClock) clock.setOffset(0);
    res.status(204).end();
  });

  router.post(
    '/__test__/clock',
    validate({ body: v.object({ offsetSeconds: v.int({ min: -31_536_000, max: 31_536_000 }) }) }),
    (_req, res) => {
      if (!(clock instanceof OffsetClock)) throw new Error('The test clock is not an OffsetClock');
      clock.setOffset(validated<{ offsetSeconds: number }>(res, 'body').offsetSeconds);
      res.json({ offsetSeconds: clock.offsetSeconds, now: clock.now().toISOString() });
    },
  );

  return router;
}
