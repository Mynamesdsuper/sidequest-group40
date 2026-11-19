import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyState } from '../../shared/ui/empty-state';

@Component({
  selector: 'app-not-found-page',
  imports: [EmptyState, RouterLink],
  template: `
    <app-empty-state title="Page not found" message="The page you are looking for does not exist.">
      <a class="btn" routerLink="/">Back to home</a>
    </app-empty-state>
  `,
})
export class NotFoundPage {}
