import { Component, input, output } from '@angular/core';

/** Inline error for a page or a form (role="alert" announces it). Optional retry button. */
@Component({
  selector: 'app-error-banner',
  template: `
    <div class="banner" role="alert">
      <span>{{ message() }}</span>
      @if (retryable()) {
        <button type="button" class="btn" (click)="retry.emit()">Retry</button>
      }
    </div>
  `,
  styles: `
    .banner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border: 1px solid var(--color-danger);
      border-radius: var(--radius-md);
      color: var(--color-danger);
    }
  `,
})
export class ErrorBanner {
  readonly message = input.required<string>();
  readonly retryable = input(false);
  readonly retry = output<void>();
}
