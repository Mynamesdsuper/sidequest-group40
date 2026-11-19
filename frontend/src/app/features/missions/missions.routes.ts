import { Routes } from '@angular/router';
import { PlaceholderPage } from '../../shared/ui/placeholder-page';

// Routes of the feature (owner P1, R02), lazy-loaded from app.routes.ts.
// TODO(R02, P1): replace the placeholder with the real pages.
export const MISSIONS_ROUTES: Routes = [
  { path: '', component: PlaceholderPage, data: { feature: 'My missions', requirement: 'R02', owner: 'P1' } },
];
