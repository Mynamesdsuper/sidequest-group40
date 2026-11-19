import { Routes } from '@angular/router';
import { PlaceholderPage } from '../../shared/ui/placeholder-page';

// Routes of the feature (owner P2, R04), lazy-loaded from app.routes.ts.
// TODO(R04, P2): replace the placeholder with the real pages.
export const PARTICIPATION_ROUTES: Routes = [
  {
    path: '',
    component: PlaceholderPage,
    data: { feature: 'My participations', requirement: 'R04', owner: 'P2' },
  },
];
