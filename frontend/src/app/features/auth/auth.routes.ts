import { Routes } from '@angular/router';
import { PlaceholderPage } from '../../shared/ui/placeholder-page';

// Routes of the feature (owner P1, R01), lazy-loaded from app.routes.ts.
// TODO(R01, P1): replace the placeholder with the real pages.
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: PlaceholderPage,
    data: { feature: 'Log in and register', requirement: 'R01', owner: 'P1' },
  },
];
