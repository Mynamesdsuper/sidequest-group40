import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

/**
 * Socket.IO connection to the backend (environment.socketUrl); the JWT goes in `auth.token` of the handshake.
 * Event names and payloads: docs/api/realtime-events.md.
 * TODO(R06A, P2): implement with socket.io-client (connect, reconnection, room joins). Now every call is a no-op.
 */
@Injectable({ providedIn: 'root' })
export class RealtimeService {
  connect(_token: string): void {
    // TODO(R06A, P2)
  }

  disconnect(): void {
    // TODO(R06A, P2)
  }

  /** Stream of the payloads of one server event. */
  on<T>(_event: string): Observable<T> {
    return EMPTY; // TODO(R06A, P2)
  }

  emit(_event: string, _payload?: unknown): void {
    // TODO(R06A, P2)
  }
}
