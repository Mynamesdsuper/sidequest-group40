import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

/** Renders the toasts in a live region, so screen readers announce them. Placed once, in the shell. */
@Component({
  selector: 'app-toast-container',
  template: `
    <div class="toasts" aria-live="polite">
      @for (toast of toasts.toasts(); track toast.id) {
        <div [class]="'toast toast-' + toast.kind" [attr.role]="toast.kind === 'error' ? 'alert' : 'status'">
          <span>{{ toast.message }}</span>
          <button
            type="button"
            class="close"
            (click)="toasts.dismiss(toast.id)"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toasts {
      position: fixed;
      inset-block-end: var(--space-4);
      inset-inline: var(--space-4);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      width: min(100%, 32rem);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      border-inline-start: 4px solid var(--color-primary);
      background: var(--color-surface);
      box-shadow: var(--shadow-md);
      pointer-events: auto;
    }
    .toast-error {
      border-color: var(--color-danger);
    }
    .toast-success {
      border-color: var(--color-success);
    }
    span {
      flex: 1;
    }
    .close {
      min-width: 2rem;
      min-height: 2rem;
      border: 0;
      background: none;
      font-size: 1.25rem;
      cursor: pointer;
    }
  `,
})
export class ToastContainer {
  protected readonly toasts = inject(ToastService);
}
