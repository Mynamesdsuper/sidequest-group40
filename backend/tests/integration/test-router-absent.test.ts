import type { Express } from 'express';
import request from 'supertest';

// The test router must not exist outside NODE_ENV=test: the app is rebuilt from fresh modules with
// NODE_ENV=development (config, clock and app read NODE_ENV when they are loaded).
describe('test router outside NODE_ENV=test', () => {
  let app: Express;
  const original = process.env.NODE_ENV;

  beforeAll(() => {
    process.env.NODE_ENV = 'development';
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      app = (require('../../src/app') as typeof import('../../src/app')).createApp({ io: null });
    });
  });

  afterAll(() => {
    process.env.NODE_ENV = original;
  });

  test.each(['/api/v1/__test__/reset', '/api/v1/__test__/clock'])('POST %s is 404', async (url) => {
    const res = await request(app).post(url).send({ offsetSeconds: 10 }).expect(404);
    expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
  });
});
