import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError, NotFoundError } from './app-error';

export interface ErrorBody {
  error: { code: string; message: string; details: Record<string, unknown> };
}

/** Maps any thrown value to an HTTP status and the uniform error body. Unknown errors never leak details. */
export function toErrorResponse(err: unknown): { status: number; body: ErrorBody } {
  if (err instanceof AppError) {
    return {
      status: err.status,
      body: { error: { code: err.code, message: err.message, details: err.details } },
    };
  }
  // Errors raised by express.json() (body-parser) carry a `type` and a `status`.
  const type = (err as { type?: string } | null)?.type;
  if (type === 'entity.parse.failed') {
    return {
      status: 400,
      body: { error: { code: 'INVALID_JSON', message: 'The request body is not valid JSON', details: {} } },
    };
  }
  if (type === 'entity.too.large') {
    return {
      status: 413,
      body: { error: { code: 'PAYLOAD_TOO_LARGE', message: 'The request body is too large', details: {} } },
    };
  }
  // Other client errors raised by Express middleware (e.g. 415 unsupported charset) keep their 4xx status;
  // `expose` marks messages that are safe to show (http-errors convention).
  const { status, expose, message } = (err ?? {}) as { status?: unknown; expose?: unknown; message?: unknown };
  if (typeof status === 'number' && status >= 400 && status < 500 && expose === true) {
    const text = typeof message === 'string' ? message : 'The request could not be processed';
    return { status, body: { error: { code: 'BAD_REQUEST', message: text, details: {} } } };
  }
  return {
    status: 500,
    body: { error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error', details: {} } },
  };
}

export const notFoundHandler: RequestHandler = (req) => {
  throw new NotFoundError(`No route for ${req.method} ${req.path}`, 'ROUTE_NOT_FOUND');
};

// Express 5 forwards rejected promises here, so routes need no try/catch wrapper.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const { status, body } = toErrorResponse(err);
  if (status >= 500) console.error(err);
  res.status(status).json(body);
};
