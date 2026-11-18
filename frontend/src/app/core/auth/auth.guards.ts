import { CanActivateFn } from '@angular/router';

/**
 * Pages that need a logged-in user.
 * TODO(R01, P1): redirect to the login page when AuthService.isAuthenticated() is false. Allows everything now.
 */
export const authGuard: CanActivateFn = () => true;

/**
 * Pages for administrators only.
 * TODO(R01, P1): allow only when AuthService.isAdmin() is true. Allows everything now.
 * The guard only hides pages: the backend checks the role on every request.
 */
export const adminGuard: CanActivateFn = () => true;
