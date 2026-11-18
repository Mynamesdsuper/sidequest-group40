import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/ui/toast.service';
import { ApiErrorBody, SKIP_ERROR_TOAST } from './api.config';

/** Readable message for a failed request: network error, the backend message, or a default per status. */
export function errorMessage(err: HttpErrorResponse): string {
  if (err.status === 0) return 'Cannot reach the server. Check your connection and try again.';
  const body = err.error as Partial<ApiErrorBody> | null;
  if (body?.error?.message) return body.error.message;
  switch (err.status) {
    case 401:
      return 'Please log in to continue.';
    case 403:
      return 'You are not allowed to do this.';
    case 404:
      return 'Not found.';
    case 409:
      return 'Someone else changed this in the meantime. Reload and try again.';
    case 429:
      return 'Too many attempts. Wait a moment and try again.';
    default:
      return err.status >= 500
        ? 'Something went wrong on the server. Try again later.'
        : 'The request failed.';
  }
}

/** Shows a toast for every failed request (unless SKIP_ERROR_TOAST is set) and rethrows the error. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toasts = inject(ToastService);
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && !req.context.get(SKIP_ERROR_TOAST)) {
        toasts.error(errorMessage(err));
      }
      return throwError(() => err);
    }),
  );
};
