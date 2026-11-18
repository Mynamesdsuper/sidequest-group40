import { Component, input } from '@angular/core';

/** Shown when a list has no items or a feature is not available yet; an action can be projected. */
@Component({
  selector: 'app-empty-state',
  template: `
    <section class="empty">
      <h2>{{ title() }}</h2>
      @if (message()) {
        <p class="text-muted">{{ message() }}</p>
      }
      <ng-content />
    </section>
  `,
  styles: `
    .empty {
      display: grid;
      justify-items: center;
      gap: var(--space-3);
      padding: var(--space-7) var(--space-4);
      text-align: center;
      border: 2px dashed var(--color-border);
      border-radius: var(--radius-lg);
    }
  `,
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly message = input<string>();
}
