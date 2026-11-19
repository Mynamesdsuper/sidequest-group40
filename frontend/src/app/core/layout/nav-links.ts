/** Main navigation: one link per feature (paths match app.routes.ts). */
export interface NavLink {
  path: string;
  label: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { path: '/', label: 'Home' },
  { path: '/explore', label: 'Explore' },
  { path: '/missions', label: 'My missions' },
  { path: '/participations', label: 'My participations' },
  { path: '/waitlist', label: 'Waiting lists' },
  { path: '/teams', label: 'Teams' },
  { path: '/team-play', label: 'Team play' },
  { path: '/invitations', label: 'Invitations' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/notifications', label: 'Notifications' },
  { path: '/profile', label: 'Profile' },
  { path: '/admin', label: 'Admin' },
  { path: '/auth', label: 'Log in' },
];
