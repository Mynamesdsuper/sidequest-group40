import { Injectable, signal } from '@angular/core';

export type ToastKind = 'info' | 'success' | 'error';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

/** Holds the visible toasts; ToastContainer renders them. Toasts close by themselves after a few seconds. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  static readonly DURATION_MS = 5000;

  private nextId = 1;
  private readonly items = signal<Toast[]>([]);
  readonly toasts = this.items.asReadonly();

  show(message: string, kind: ToastKind = 'info'): number {
    const id = this.nextId++;
    this.items.update((list) => [...list, { id, kind, message }]);
    setTimeout(() => this.dismiss(id), ToastService.DURATION_MS);
    return id;
  }

  error(message: string): number {
    return this.show(message, 'error');
  }

  success(message: string): number {
    return this.show(message, 'success');
  }

  dismiss(id: number): void {
    this.items.update((list) => list.filter((t) => t.id !== id));
  }
}
