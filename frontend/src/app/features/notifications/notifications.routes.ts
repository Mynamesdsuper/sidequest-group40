import { Routes } from '@angular/router';
import { PlaceholderPage } from '../../shared/ui/placeholder-page';

// Routes of the feature (owner P2, R06), lazy-loaded from app.routes.ts.
// TODO(R06, P2): replace the placeholder with the real pages.
export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: PlaceholderPage,
    data: { feature: 'Notifications', requirement: 'R06', owner: 'P2' },
  },
];
