import { Injectable, computed, signal } from '@angular/core';

/** Minimal shape of the logged-in user; R01 defines the real one. */
export interface CurrentUser {
  id: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
}

/**
 * Session state of the client.
 * TODO(R01, P1): login/logout/register against the backend, keep the JWT (localStorage), restore it on start.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<CurrentUser | null>(null);
  readonly token = signal<string | null>(null);
  readonly isAuthenticated = computed(() => this.token() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
}
