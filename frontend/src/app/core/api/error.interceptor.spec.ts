import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ToastService } from '../../shared/ui/toast.service';
import { SKIP_ERROR_TOAST, apiUrl } from './api.config';
import { errorInterceptor, errorMessage } from './error.interceptor';

describe('errorMessage', () => {
  const res = (status: number, error: unknown = null) => new HttpErrorResponse({ status, error });

  it('explains a network error', () => {
    expect(errorMessage(res(0))).toContain('Cannot reach the server');
  });

  it('prefers the message of the backend error body', () => {
    const body = { error: { code: 'MISSION_FULL', message: 'The mission is full.' } };
    expect(errorMessage(res(409, body))).toBe('The mission is full.');
  });

  it('falls back to a message per status', () => {
    expect(errorMessage(res(401))).toContain('log in');
    expect(errorMessage(res(404))).toBe('Not found.');
    expect(errorMessage(res(503))).toContain('server');
    expect(errorMessage(res(418))).toBe('The request failed.');
  });
});

describe('errorInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let toasts: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([errorInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    toasts = TestBed.inject(ToastService);
  });

  it('shows an error toast and still rethrows the error', () => {
    let failed = false;
    http.get(apiUrl('missions')).subscribe({ error: () => (failed = true) });
    backend.expectOne(apiUrl('missions')).flush(null, { status: 500, statusText: 'Server Error' });
    expect(failed).toBe(true);
    expect(toasts.toasts()).toEqual([expect.objectContaining({ kind: 'error' })]);
  });

  it('shows no toast when SKIP_ERROR_TOAST is set', () => {
    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);
    http.get(apiUrl('missions'), { context }).subscribe({ error: () => undefined });
    backend.expectOne(apiUrl('missions')).flush(null, { status: 400, statusText: 'Bad Request' });
    expect(toasts.toasts()).toEqual([]);
  });
});
