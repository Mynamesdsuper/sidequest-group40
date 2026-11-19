import type { Page } from '@playwright/test';
import type { DemoUser } from './users';

/**
 * Logs `user` in through the UI and leaves the page on the authenticated home.
 * TODO(R01, P1): implement once the login page exists (fill email/password, submit, wait for the home).
 */
export async function loginAs(_page: Page, user: DemoUser): Promise<void> {
  throw new Error(`loginAs(${user.nickname}) is not implemented yet: TODO(R01, P1)`);
}
