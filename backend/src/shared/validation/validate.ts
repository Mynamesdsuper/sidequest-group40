import type { RequestHandler, Response } from 'express';
import { ValidationError } from '../errors';
import type { FieldError, Validator } from './validator';

interface Schemas {
  body?: Validator<unknown>;
  query?: Validator<unknown>;
  params?: Validator<unknown>;
}

export interface Validated {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

/**
 * Validates body, query and params. On failure: 400 VALIDATION_ERROR with
 * details.fields = { "body.title": "must be at least 3 characters", ... }.
 * On success the cleaned values are in res.locals.validated (Express 5 makes req.query read-only).
 */
export function validate(schemas: Schemas): RequestHandler {
  return (req, res, next) => {
    const errors: FieldError[] = [];
    const validated: Validated = {};
    for (const where of ['body', 'query', 'params'] as const) {
      const schema = schemas[where];
      if (!schema) continue;
      const r = schema.validate(req[where] ?? {}, where);
      if (r.ok) validated[where] = r.value;
      else errors.push(...r.errors);
    }
    if (errors.length) {
      const fields = Object.fromEntries(errors.map((e) => [e.path, e.message]));
      throw new ValidationError('The request is not valid', { fields });
    }
    res.locals.validated = validated;
    next();
  };
}

/** Typed access to the values checked by validate(). */
export function validated<T>(res: Response, where: keyof Validated): T {
  return (res.locals.validated as Validated)[where] as T;
}
