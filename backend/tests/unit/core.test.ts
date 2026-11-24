import { OffsetClock, type Clock } from '../../src/shared/clock';
import { loadConfig } from '../../src/shared/config';
import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  toErrorResponse,
} from '../../src/shared/errors';
import { EventBus } from '../../src/shared/events';
import { bindPort, getPort, resetPorts, type TeamMembershipPort } from '../../src/shared/ports';

describe('OffsetClock', () => {
  const fixed: Clock = { now: () => new Date('2026-11-17T10:00:00.000Z') };

  test('starts with no offset and shifts by whole seconds, also backwards', () => {
    const clock = new OffsetClock(fixed);
    expect(clock.now().toISOString()).toBe('2026-11-17T10:00:00.000Z');
    clock.setOffset(3600);
    expect(clock.now().toISOString()).toBe('2026-11-17T11:00:00.000Z');
    expect(clock.offsetSeconds).toBe(3600);
    clock.setOffset(-60);
    expect(clock.now().toISOString()).toBe('2026-11-17T09:59:00.000Z');
  });
});

describe('error mapping', () => {
  test.each([
    [new ValidationError('bad', { fields: { 'body.x': 'is required' } }), 400, 'VALIDATION_ERROR'],
    [new UnauthorizedError(), 401, 'UNAUTHORIZED'],
    [new ForbiddenError(), 403, 'FORBIDDEN'],
    [new NotFoundError(), 404, 'NOT_FOUND'],
    [new ConflictError('full', 'MISSION_FULL'), 409, 'MISSION_FULL'],
  ])('%s -> %i %s', (err, status, code) => {
    const r = toErrorResponse(err);
    expect(r.status).toBe(status);
    expect(r.body.error.code).toBe(code);
    expect(err).toBeInstanceOf(AppError);
  });

  test('keeps the details of an AppError', () => {
    const r = toErrorResponse(new ValidationError('bad', { fields: { 'body.x': 'is required' } }));
    expect(r.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'bad', details: { fields: { 'body.x': 'is required' } } },
    });
  });

  test('JSON parse errors and oversized bodies from express.json()', () => {
    expect(toErrorResponse({ type: 'entity.parse.failed' }).body.error.code).toBe('INVALID_JSON');
    expect(toErrorResponse({ type: 'entity.too.large' }).status).toBe(413);
    expect(toErrorResponse({ status: 415, expose: true, message: 'unsupported charset' }).status).toBe(415);
    // Without `expose` the status is not trusted: generic 500.
    expect(toErrorResponse({ status: 404, message: 'x' }).status).toBe(500);
  });

  test('unknown errors become a generic 500 without leaking the message', () => {
    const r = toErrorResponse(new Error('password=secret'));
    expect(r.status).toBe(500);
    expect(JSON.stringify(r.body)).not.toContain('secret');
  });
});

describe('EventBus (Observer)', () => {
  test('delivers to every subscriber in order and supports unsubscribe', async () => {
    const bus = new EventBus();
    const seen: string[] = [];
    bus.subscribe('team.member.joined', (p) => void seen.push(`a:${p.teamId}`));
    const off = bus.subscribe('team.member.joined', async (p) => void seen.push(`b:${p.teamId}`));
    await bus.publish('team.member.joined', { teamId: 't1', userId: 'u1' });
    off();
    await bus.publish('team.member.joined', { teamId: 't2', userId: 'u1' });
    expect(seen).toEqual(['a:t1', 'b:t1', 'a:t2']);
  });

  test('a failing subscriber does not stop the others', async () => {
    const bus = new EventBus();
    const seen: string[] = [];
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    bus.subscribe('mission.published', () => {
      throw new Error('boom');
    });
    bus.subscribe('mission.published', () => void seen.push('ok'));
    await expect(bus.publish('mission.published', { missionId: 'm1', authorId: 'u1' })).resolves.toBeUndefined();
    expect(seen).toEqual(['ok']);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('events without subscribers are fine', async () => {
    await expect(new EventBus().publish('user.registered', { userId: 'u1' })).resolves.toBeUndefined();
  });
});

describe('port registry (Strategy + Dependency Injection)', () => {
  afterEach(resetPorts);

  test('safe defaults before any binding', async () => {
    expect(await getPort('teamMembership').isMember('t', 'u')).toBe(false);
    expect(await getPort('teamMembership').membersOf('t')).toEqual([]);
    expect(await getPort('teamMembership').teamsOf('u')).toEqual([]);
    expect(await getPort('participationQuery').availability(['m1', 'm2'])).toEqual({
      m1: 'AVAILABLE',
      m2: 'AVAILABLE',
    });
    expect(await getPort('participationQuery').hasStarted('m1')).toBe(false);
    expect(await getPort('missionAccess').canView(null, 'm1')).toBe(true);
    await expect(getPort('notifier').notify('u', 'mission.accepted', {})).resolves.toBeUndefined();
    expect(() => getPort('realtime').emitToRoom('r', 'e', {})).not.toThrow();
  });

  test('a bound strategy replaces the default, resetPorts restores it', async () => {
    const real: TeamMembershipPort = {
      isMember: async () => true,
      isAdmin: async () => true,
      membersOf: async () => ['u'],
      teamsOf: async () => ['t'],
    };
    bindPort('teamMembership', real);
    expect(getPort('teamMembership')).toBe(real);
    resetPorts();
    expect(await getPort('teamMembership').isMember('t', 'u')).toBe(false);
  });
});

describe('config', () => {
  const env = {
    NODE_ENV: 'development',
    PORT: '3000',
    DATABASE_URL: 'postgres://dev',
    TEST_DATABASE_URL: 'postgres://test',
    TOKEN_SECRET: 'a-long-secret',
    TOKEN_EXPIRES_IN: '2h',
    FRONTEND_ORIGIN: 'http://localhost:4200',
    UPLOAD_DIR: 'uploads',
    MAX_UPLOAD_MB: '5',
  };

  test('typed values and the database chosen by NODE_ENV', () => {
    expect(loadConfig(env)).toMatchObject({ PORT: 3000, MAX_UPLOAD_MB: 5, dbUrl: 'postgres://dev' });
    expect(loadConfig({ ...env, NODE_ENV: 'test' }).dbUrl).toBe('postgres://test');
  });

  test('fails at boot with a readable list of problems', () => {
    expect(() => loadConfig({ ...env, PORT: 'abc', TOKEN_SECRET: undefined })).toThrow(
      /PORT: must be an integer[\s\S]*TOKEN_SECRET: is required/,
    );
    expect(() => loadConfig({ ...env, NODE_ENV: 'test', TEST_DATABASE_URL: undefined })).toThrow(
      /TEST_DATABASE_URL/,
    );
    expect(() => loadConfig({ ...env, NODE_ENV: 'production', TOKEN_SECRET: 'change-me' })).toThrow(
      /must be changed/,
    );
  });
});
