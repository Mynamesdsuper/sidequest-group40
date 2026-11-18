// AppError hierarchy: services throw these; the error handler turns them into
// { "error": { "code", "message", "details" } } with the right HTTP status.

export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'The request is not valid',
    details: Record<string, unknown> = {},
    code = 'VALIDATION_ERROR',
  ) {
    super(400, code, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication is required', code = 'UNAUTHORIZED') {
    super(401, code, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You are not allowed to do this', code = 'FORBIDDEN') {
    super(403, code, message);
  }
}

/** Also used for restricted resources the caller may not see (A-16: 404, never 403). */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(404, code, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code = 'CONFLICT', details: Record<string, unknown> = {}) {
    super(409, code, message, details);
  }
}
