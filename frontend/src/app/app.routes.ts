import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/auth';
import { HomePage } from './core/layout/home-page';
import { NotFoundPage } from './core/layout/not-found-page';

// Written once by the scaffold: every feature is lazy-loaded and owns its child routes in <feature>.routes.ts.
// Add pages inside the feature's routes file, not here.
export const routes: Routes = [
  { path: '', component: HomePage, title: 'SideQuest' },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES) },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'missions',
    canActivate: [authGuard],
    loadChildren: () => import('./features/missions/missions.routes').then((m) => m.MISSIONS_ROUTES),
  },
  {
    path: 'explore',
    loadChildren: () => import('./features/explore/explore.routes').then((m) => m.EXPLORE_ROUTES),
  },
  {
    path: 'participations',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/participation/participation.routes').then((m) => m.PARTICIPATION_ROUTES),
  },
  {
    path: 'waitlist',
    canActivate: [authGuard],
    loadChildren: () => import('./features/waitlist/waitlist.routes').then((m) => m.WAITLIST_ROUTES),
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/notifications/notifications.routes').then((m) => m.NOTIFICATIONS_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'invitations',
    canActivate: [authGuard],
    loadChildren: () => import('./features/invitations/invitations.routes').then((m) => m.INVITATIONS_ROUTES),
  },
  {
    path: 'teams',
    canActivate: [authGuard],
    loadChildren: () => import('./features/teams/teams.routes').then((m) => m.TEAMS_ROUTES),
  },
  {
    path: 'team-play',
    canActivate: [authGuard],
    loadChildren: () => import('./features/team-play/team-play.routes').then((m) => m.TEAM_PLAY_ROUTES),
  },
  { path: '**', component: NotFoundPage, title: 'Not found' },
];
