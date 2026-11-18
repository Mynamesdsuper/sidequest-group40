import { Routes } from '@angular/router';
import { PlaceholderPage } from '../../shared/ui/placeholder-page';

// Routes of the feature (owner P1, R03), lazy-loaded from app.routes.ts.
// TODO(R03, P1): replace the placeholder with the real pages.
export const EXPLORE_ROUTES: Routes = [
  {
    path: '',
    component: PlaceholderPage,
    data: { feature: 'Explore', requirement: 'R03', owner: 'P1', showsMap: true },
  },
];
