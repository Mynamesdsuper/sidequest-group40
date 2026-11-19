import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmptyState } from './empty-state';

/** Temporary page of a feature not built yet. Reads feature, requirement and owner from the route data. */
@Component({
  selector: 'app-placeholder-page',
  imports: [EmptyState],
  template: `
    <app-empty-state
      [title]="data['feature'] + ' — coming in ' + data['requirement'] + ' (owner ' + data['owner'] + ')'"
      message="This page is a placeholder created by the scaffold."
    />
  `,
})
export class PlaceholderPage {
  protected readonly data = inject(ActivatedRoute).snapshot.data;
}
