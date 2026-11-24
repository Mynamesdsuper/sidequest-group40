import { v, type FieldError, type ValidationResult } from '../../src/shared/validation';

const errorsOf = <T>(r: ValidationResult<T>): FieldError[] => (r.ok ? [] : r.errors);
const valueOf = <T>(r: ValidationResult<T>): T => {
  if (!r.ok) throw new Error(`expected ok, got ${JSON.stringify(r.errors)}`);
  return r.value;
};

describe('Validator rules', () => {
  test('required by default, optional on request', () => {
    expect(errorsOf(v.string().validate(undefined, 'name'))).toEqual([
      { path: 'name', message: 'is required' },
    ]);
    expect(errorsOf(v.string().validate(null, 'name'))[0].message).toBe('is required');
    expect(valueOf(v.string().optional().validate(undefined))).toBeUndefined();
    expect(errorsOf(v.string().optional().required().validate(undefined))[0].message).toBe('is required');
  });

  test('string with boundary lengths', () => {
    const title = v.string({ min: 3, max: 5 });
    expect(valueOf(title.validate('abc'))).toBe('abc');
    expect(valueOf(title.validate('abcde'))).toBe('abcde');
    expect(errorsOf(title.validate('ab'))[0].message).toBe('must be at least 3 characters');
    expect(errorsOf(title.validate('abcdef'))[0].message).toBe('must be at most 5 characters');
    expect(errorsOf(title.validate(42))[0].message).toBe('must be a string');
  });

  test('int and number accept numbers and numeric strings (query strings)', () => {
    expect(valueOf(v.int({ min: 1, max: 10 }).validate('7'))).toBe(7);
    expect(valueOf(v.int({ min: 1, max: 10 }).validate(10))).toBe(10);
    expect(errorsOf(v.int().validate(1.5))[0].message).toBe('must be an integer');
    expect(errorsOf(v.int().validate('abc'))[0].message).toBe('must be an integer');
    expect(errorsOf(v.int({ min: 1 }).validate(0))[0].message).toBe('must be at least 1');
    expect(valueOf(v.number().validate('2.5'))).toBe(2.5);
    expect(errorsOf(v.number().validate(''))[0].message).toBe('must be a number');
    expect(errorsOf(v.number().validate(Number.NaN))[0].message).toBe('must be a number');
  });

  test('boolean, enum, email, uuid', () => {
    expect(valueOf(v.boolean().validate('true'))).toBe(true);
    expect(valueOf(v.boolean().validate(false))).toBe(false);
    expect(errorsOf(v.boolean().validate('yes'))[0].message).toBe('must be a boolean');
    expect(valueOf(v.enum(['PUBLIC', 'RESTRICTED'] as const).validate('PUBLIC'))).toBe('PUBLIC');
    expect(errorsOf(v.enum(['PUBLIC', 'RESTRICTED'] as const).validate('public'))[0].message).toBe(
      'must be one of: PUBLIC, RESTRICTED',
    );
    expect(valueOf(v.email().validate('Alice@SideQuest.test'))).toBe('alice@sidequest.test');
    expect(errorsOf(v.email().validate('alice@'))[0].message).toBe('must be a valid email address');
    expect(valueOf(v.uuid().validate('3F2504E0-4F89-41D3-9A0C-0305E82C3301'))).toBe(
      '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
    );
    expect(errorsOf(v.uuid().validate('not-a-uuid'))[0].message).toBe('must be a UUID');
  });

  test('isoDate, latitude, longitude', () => {
    expect(valueOf(v.isoDate().validate('2026-11-17T10:00:00Z')).toISOString()).toBe(
      '2026-11-17T10:00:00.000Z',
    );
    expect(valueOf(v.isoDate().validate('2026-11-17')).getUTCDate()).toBe(17);
    expect(errorsOf(v.isoDate().validate('17/11/2026'))[0].message).toBe('must be an ISO 8601 date');
    expect(errorsOf(v.isoDate().validate('2026-13-40'))[0].message).toBe('must be an ISO 8601 date');
    // Impossible days are rejected, not rolled over into the next month.
    expect(errorsOf(v.isoDate().validate('2026-02-31'))[0].message).toBe('must be an ISO 8601 date');
    expect(errorsOf(v.isoDate().validate('2026-04-31T10:00:00Z'))[0].message).toBe('must be an ISO 8601 date');
    expect(valueOf(v.isoDate().validate('2028-02-29')).getUTCDate()).toBe(29);
    // An offset may move the UTC day: the date as written is what counts.
    expect(valueOf(v.isoDate().validate('2026-02-28T23:30:00-02:00')).toISOString()).toBe(
      '2026-03-01T01:30:00.000Z',
    );
    expect(valueOf(v.latitude().validate(-90))).toBe(-90);
    expect(errorsOf(v.latitude().validate(90.1))[0].message).toBe('must be at most 90');
    expect(errorsOf(v.longitude().validate(-180.5))[0].message).toBe('must be at least -180');
  });

  test('nested objects and arrays report every failing path; unknown keys are dropped', () => {
    const schema = v.object({
      title: v.string({ min: 3 }),
      place: v.object({ lat: v.latitude(), lng: v.longitude() }).optional(),
      objectives: v.array(v.object({ points: v.int({ min: 0, max: 100 }) }), { min: 1, max: 3 }),
    });
    const r = schema.validate(
      { title: 'ab', place: { lat: 100, lng: 0 }, objectives: [{ points: 5 }, { points: 101 }], admin: true },
      'body',
    );
    expect(errorsOf(r)).toEqual([
      { path: 'body.title', message: 'must be at least 3 characters' },
      { path: 'body.place.lat', message: 'must be at most 90' },
      { path: 'body.objectives[1].points', message: 'must be at most 100' },
    ]);
    const good = valueOf(schema.validate({ title: 'abc', objectives: [{ points: 0 }], admin: true }));
    expect(good).toEqual({ title: 'abc', objectives: [{ points: 0 }] });
    expect(errorsOf(schema.validate({ title: 'abc', objectives: [] }))[0]).toEqual({
      path: 'objectives',
      message: 'must be at least 1 items',
    });
    expect(errorsOf(v.object({}).validate([]))[0].message).toBe('must be an object');
    expect(errorsOf(v.array(v.int()).validate('x'))[0].message).toBe('must be an array');
  });
});
