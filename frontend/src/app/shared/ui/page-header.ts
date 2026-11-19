import { Component, input } from '@angular/core';

/** Page title with an optional subtitle; actions (buttons, links) are projected on the right. */
@Component({
  selector: 'app-page-header',
  template: `
    <header class="page-header">
      <div class="titles">
        <h1>{{ title() }}</h1>
        @if (subtitle()) {
          <p class="text-muted">{{ subtitle() }}</p>
        }
      </div>
      <div class="cluster"><ng-content /></div>
    </header>
  `,
  styles: `
    .page-header {
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      justify-content: space-between;
      gap: var(--space-4);
      margin-block-end: var(--space-5);
    }
    .titles {
      display: grid;
      gap: var(--space-1);
    }
  `,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
