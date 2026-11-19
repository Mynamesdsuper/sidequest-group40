import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from '../api';
import { AuthService } from './auth.service';

/**
 * Adds `Authorization: Bearer <jwt>` to requests sent to our API (never to other hosts, e.g. map tiles).
 * TODO(R01, P1): on 401, clear the session and go to the login page.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  if (!token || !req.url.startsWith(API_BASE_URL)) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
