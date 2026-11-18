// Server-authoritative time (ADR 0003). Domain code gets the time ONLY from the Clock, never Date.now(),
// so tests can move the server clock (OffsetClock) without waiting.

export interface Clock {
  now(): Date;
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

/** A clock shifted by a number of seconds. Used only when NODE_ENV=test (POST /__test__/clock). */
export class OffsetClock implements Clock {
  private offsetMs = 0;

  constructor(private readonly base: Clock = new SystemClock()) {}

  setOffset(seconds: number): void {
    this.offsetMs = seconds * 1000;
  }

  get offsetSeconds(): number {
    return this.offsetMs / 1000;
  }

  now(): Date {
    return new Date(this.base.now().getTime() + this.offsetMs);
  }
}

/** The process-wide clock (Singleton): an OffsetClock in tests, the system clock otherwise. */
export const clock: Clock = process.env.NODE_ENV === 'test' ? new OffsetClock() : new SystemClock();
