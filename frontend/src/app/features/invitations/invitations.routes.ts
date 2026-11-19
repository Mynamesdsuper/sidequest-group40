import { Routes } from '@angular/router';
import { PlaceholderPage } from '../../shared/ui/placeholder-page';

// Routes of the feature (owner P3, R08), lazy-loaded from app.routes.ts.
// TODO(R08, P3): replace the placeholder with the real pages.
export const INVITATIONS_ROUTES: Routes = [
  { path: '', component: PlaceholderPage, data: { feature: 'Invitations', requirement: 'R08', owner: 'P3' } },
];
