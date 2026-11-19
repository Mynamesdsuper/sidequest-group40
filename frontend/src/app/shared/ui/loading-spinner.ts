import { Component, input } from '@angular/core';

/** Accessible loading indicator: the label is read by screen readers, the ring is decorative. */
@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner" role="status">
      <span class="ring" aria-hidden="true"></span>
      <span class="visually-hidden">{{ label() }}</span>
    </div>
  `,
  styles: `
    .spinner {
      display: flex;
      justify-content: center;
      padding: var(--space-4);
    }
    .ring {
      width: 2rem;
      height: 2rem;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class LoadingSpinner {
  readonly label = input('Loading…');
}
