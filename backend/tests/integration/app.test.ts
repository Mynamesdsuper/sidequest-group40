import request from 'supertest';
import { closeDb, createTestApp, migrateTestDb, resetDb } from '../helpers/test-app';

const app = createTestApp();

beforeAll(migrateTestDb);
afterAll(closeDb);

describe('GET /api/v1/health', () => {
  test('answers ok with the database up and the server time', async () => {
    const res = await request(app).get('/api/v1/health').expect(200);
    expect(res.body).toMatchObject({ status: 'ok', db: 'up' });
    expect(Math.abs(new Date(res.body.time).getTime() - Date.now())).toBeLessThan(5000);
  });
});

describe('unknown routes', () => {
  test('return a 404 JSON error in the uniform format', async () => {
    const res = await request(app).get('/api/v1/does-not-exist').expect(404).expect('Content-Type', /json/);
    expect(res.body).toEqual({
      error: { code: 'ROUTE_NOT_FOUND', message: 'No route for GET /api/v1/does-not-exist', details: {} },
    });
  });

  test('invalid JSON bodies return 400 INVALID_JSON', async () => {
    const res = await request(app)
      .post('/api/v1/__test__/clock')
      .set('Content-Type', 'application/json')
      .send('{"offsetSeconds":')
      .expect(400);
    expect(res.body.error.code).toBe('INVALID_JSON');
  });
});

describe('API docs', () => {
  test('/api/docs.json is a valid merged OpenAPI 3.1 document', async () => {
    const res = await request(app).get('/api/docs.json').expect(200);
    expect(res.body.openapi).toBe('3.1.0');
    expect(res.body.info.title).toBe('SideQuest API');
    expect(res.body.paths['/health'].get.responses['200']).toBeDefined();
    expect(res.body.components.schemas.Error).toBeDefined();
    expect(res.body.tags.map((t: { name: string }) => t.name)).toContain('Teams');
  });

  test('/api/docs serves Swagger UI', async () => {
    const res = await request(app).get('/api/docs/').expect(200);
    expect(res.text).toContain('swagger-ui');
  });
});

describe('validate() middleware (through POST /__test__/clock)', () => {
  test('400 VALIDATION_ERROR with per-field details', async () => {
    const res = await request(app).post('/api/v1/__test__/clock').send({ offsetSeconds: 'soon' }).expect(400);
    expect(res.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'The request is not valid',
        details: { fields: { 'body.offsetSeconds': 'must be an integer' } },
      },
    });
  });

  test('a missing field is reported as required', async () => {
    const res = await request(app).post('/api/v1/__test__/clock').send({}).expect(400);
    expect(res.body.error.details.fields).toEqual({ 'body.offsetSeconds': 'is required' });
  });
});

describe('test router (NODE_ENV=test)', () => {
  afterAll(() => request(app).post('/api/v1/__test__/clock').send({ offsetSeconds: 0 }));

  test('moves the server clock: /health shows the shifted time', async () => {
    await request(app).post('/api/v1/__test__/clock').send({ offsetSeconds: 3600 }).expect(200);
    const res = await request(app).get('/api/v1/health').expect(200);
    const shift = new Date(res.body.time).getTime() - Date.now();
    expect(shift).toBeGreaterThan(3595_000);
    expect(shift).toBeLessThan(3605_000);
  });

  test('reset empties the tables, runs the seeds and puts the clock back', async () => {
    await request(app).post('/api/v1/__test__/clock').send({ offsetSeconds: 60 }).expect(200);
    await request(app).post('/api/v1/__test__/reset').expect(204);
    const res = await request(app).get('/api/v1/health');
    expect(Math.abs(new Date(res.body.time).getTime() - Date.now())).toBeLessThan(5000);
    await resetDb(); // the helper used by future integration tests works too
  });
});
