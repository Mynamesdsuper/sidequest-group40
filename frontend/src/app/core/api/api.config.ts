import { HttpContextToken } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/** Base URL of the REST API (`/api/v1`), from the environment. */
export const API_BASE_URL = environment.apiBaseUrl;

/** Absolute URL of an API path, e.g. apiUrl('missions') or apiUrl('/missions/1'). */
export function apiUrl(path: string): string {
  return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
}

/**
 * Set to true on a request whose errors the caller shows by itself (for example field errors of a form):
 * http.post(url, body, { context: new HttpContext().set(SKIP_ERROR_TOAST, true) }).
 */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

/** Body of every backend error: { "error": { "code", "message", "details" } }. */
export interface ApiErrorBody {
  error: { code: string; message: string; details?: unknown };
}

/** Paginated list returned by the backend (`?page=1&pageSize=20`). */
export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
