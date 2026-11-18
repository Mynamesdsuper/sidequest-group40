// Hand-written validation toolkit (no library, see ADR 0006).
// A Validator<T> checks an unknown value and returns either the typed value or a list of field errors.
// Rules are created with the `v` factory and chained: v.string({ min: 3 }).optional().
// Query strings arrive as text, so int/number/boolean also accept their string form ("42", "true").

export interface FieldError {
  path: string;
  message: string;
}

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: FieldError[] };

type Check<T> = (value: unknown, path: string) => ValidationResult<T>;

const ok = <T>(value: T): ValidationResult<T> => ({ ok: true, value });
const fail = (path: string, message: string): ValidationResult<never> => ({
  ok: false,
  errors: [{ path, message }],
});
const join = (base: string, key: string | number): string =>
  typeof key === 'number' ? `${base}[${key}]` : base ? `${base}.${key}` : key;

export class Validator<T> {
  constructor(
    private readonly check: Check<T>,
    readonly isOptional = false,
  ) {}

  /** The value may be missing (undefined or null): it is then returned as undefined. */
  optional(): Validator<T | undefined> {
    return new Validator<T | undefined>(this.check, true);
  }

  /** The value must be present (the default; useful to undo optional()). */
  required(): Validator<Exclude<T, undefined>> {
    return new Validator(this.check as Check<Exclude<T, undefined>>, false);
  }

  validate(value: unknown, path = ''): ValidationResult<T> {
    if (value === undefined || value === null) {
      return this.isOptional ? ok(undefined as T) : fail(path, 'is required');
    }
    return this.check(value, path);
  }
}

export type Infer<V> = V extends Validator<infer T> ? T : never;
type Shape = Record<string, Validator<unknown>>;
type InferShape<S extends Shape> = { [K in keyof S]: Infer<S[K]> };

interface Bounds {
  min?: number;
  max?: number;
}

function inRange(n: number, path: string, { min, max }: Bounds, unit = ''): ValidationResult<number> {
  if (min !== undefined && n < min) return fail(path, `must be at least ${min}${unit}`);
  if (max !== undefined && n > max) return fail(path, `must be at most ${max}${unit}`);
  return ok(n);
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) return Number(value);
  return undefined;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2}))?$/;

function number(bounds: Bounds = {}, integer = false): Validator<number> {
  return new Validator<number>((value, path) => {
    const n = toNumber(value);
    if (n === undefined) return fail(path, integer ? 'must be an integer' : 'must be a number');
    if (integer && !Number.isInteger(n)) return fail(path, 'must be an integer');
    return inRange(n, path, bounds);
  });
}

export const v = {
  string(bounds: Bounds = {}): Validator<string> {
    return new Validator<string>((value, path) => {
      if (typeof value !== 'string') return fail(path, 'must be a string');
      const r = inRange(value.length, path, bounds, ' characters');
      return r.ok ? ok(value) : r;
    });
  },
  int: (bounds: Bounds = {}) => number(bounds, true),
  number: (bounds: Bounds = {}) => number(bounds, false),
  boolean(): Validator<boolean> {
    return new Validator<boolean>((value, path) => {
      if (typeof value === 'boolean') return ok(value);
      if (value === 'true' || value === 'false') return ok(value === 'true');
      return fail(path, 'must be a boolean');
    });
  },
  enum<const E extends readonly string[]>(values: E): Validator<E[number]> {
    return new Validator<E[number]>((value, path) =>
      typeof value === 'string' && values.includes(value)
        ? ok(value as E[number])
        : fail(path, `must be one of: ${values.join(', ')}`),
    );
  },
  email(): Validator<string> {
    return new Validator<string>((value, path) =>
      typeof value === 'string' && value.length <= 254 && EMAIL.test(value)
        ? ok(value.toLowerCase())
        : fail(path, 'must be a valid email address'),
    );
  },
  uuid(): Validator<string> {
    return new Validator<string>((value, path) =>
      typeof value === 'string' && UUID.test(value) ? ok(value.toLowerCase()) : fail(path, 'must be a UUID'),
    );
  },
  isoDate(): Validator<Date> {
    return new Validator<Date>((value, path) => {
      if (typeof value !== 'string' || !ISO_DATE.test(value)) return fail(path, 'must be an ISO 8601 date');
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? fail(path, 'must be an ISO 8601 date') : ok(d);
    });
  },
  latitude: () => number({ min: -90, max: 90 }),
  longitude: () => number({ min: -180, max: 180 }),
  array<T>(of: Validator<T>, bounds: Bounds = {}): Validator<T[]> {
    return new Validator<T[]>((value, path) => {
      if (!Array.isArray(value)) return fail(path, 'must be an array');
      const len = inRange(value.length, path, bounds, ' items');
      if (!len.ok) return len;
      const out: T[] = [];
      const errors: FieldError[] = [];
      value.forEach((item, i) => {
        const r = of.validate(item, join(path, i));
        if (r.ok) out.push(r.value);
        else errors.push(...r.errors);
      });
      return errors.length ? { ok: false, errors } : ok(out);
    });
  },
  /** Validates every key of the shape; unknown keys are dropped, never passed on. */
  object<S extends Shape>(shape: S): Validator<InferShape<S>> {
    return new Validator<InferShape<S>>((value, path) => {
      if (typeof value !== 'object' || Array.isArray(value)) return fail(path, 'must be an object');
      const input = value as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      const errors: FieldError[] = [];
      for (const [key, rule] of Object.entries(shape)) {
        const r = rule.validate(input[key], join(path, key));
        if (!r.ok) errors.push(...r.errors);
        else if (r.value !== undefined) out[key] = r.value;
      }
      return errors.length ? { ok: false, errors } : ok(out as InferShape<S>);
    });
  },
};
