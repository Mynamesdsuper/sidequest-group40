import { Routes } from '@angular/router';
import { PlaceholderPage } from '../../shared/ui/placeholder-page';

// Routes of the feature (owner P2, R09), lazy-loaded from app.routes.ts.
// TODO(R09, P2): replace the placeholder with the real pages.
export const WAITLIST_ROUTES: Routes = [
  {
    path: '',
    component: PlaceholderPage,
    data: { feature: 'Waiting lists', requirement: 'R09', owner: 'P2' },
  },
];
