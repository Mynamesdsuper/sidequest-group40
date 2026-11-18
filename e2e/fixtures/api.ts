import { expect, request, type APIRequestContext } from '@playwright/test';

/** Backend origin (default port of backend/.env.example). */
export const API_URL = process.env.E2E_API_URL ?? 'http://localhost:3000';

/** Response of GET /api/v1/health (backend `app.ts`). */
export interface Health {
  status: 'ok';
  db: 'up' | 'down';
  time: string;
}

/** A request context on the API root, optionally authenticated with a JWT (Authorization: Bearer). */
export async function apiContext(token?: string): Promise<APIRequestContext> {
  return request.newContext({
    baseURL: `${API_URL}/api/v1/`,
    extraHTTPHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

/** GET a path relative to /api/v1, expect a 2xx and return the JSON body typed as T. */
export async function getJson<T>(api: APIRequestContext, path: string): Promise<T> {
  const res = await api.get(path);
  expect(res.ok(), `GET ${path} answered ${res.status()}`).toBe(true);
  return (await res.json()) as T;
}

/** POST a JSON body to a path relative to /api/v1, expect a 2xx and return the JSON body typed as T. */
export async function postJson<T>(api: APIRequestContext, path: string, body?: unknown): Promise<T> {
  const res = await api.post(path, { data: body });
  expect(res.ok(), `POST ${path} answered ${res.status()}`).toBe(true);
  return (res.status() === 204 ? undefined : await res.json()) as T;
}
