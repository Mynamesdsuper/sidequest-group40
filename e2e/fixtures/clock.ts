import { apiContext, postJson } from './api';

/**
 * Moves the server clock (the backend `OffsetClock`, NODE_ENV=test only) by `seconds` from real time.
 * Used by the timer tests (R04) instead of waiting. The offset is absolute, not cumulative; 0 restores real time.
 */
export async function setServerClockOffset(seconds: number): Promise<{ offsetSeconds: number; now: string }> {
  const api = await apiContext();
  try {
    return await postJson(api, '__test__/clock', { offsetSeconds: seconds });
  } finally {
    await api.dispose();
  }
}
