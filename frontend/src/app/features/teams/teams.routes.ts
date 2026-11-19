import { Routes } from '@angular/router';
import { PlaceholderPage } from '../../shared/ui/placeholder-page';

// Routes of the feature (owner P3, R10), lazy-loaded from app.routes.ts.
// TODO(R10, P3): replace the placeholder with the real pages.
export const TEAMS_ROUTES: Routes = [
  { path: '', component: PlaceholderPage, data: { feature: 'Teams', requirement: 'R10', owner: 'P3' } },
];
