import { Routes } from '@angular/router';
import { PlaceholderPage } from '../../shared/ui/placeholder-page';

// Routes of the feature (owner P3, R11), lazy-loaded from app.routes.ts.
// TODO(R11, P3): replace the placeholder with the real pages.
export const TEAM_PLAY_ROUTES: Routes = [
  { path: '', component: PlaceholderPage, data: { feature: 'Team play', requirement: 'R11', owner: 'P3' } },
];
