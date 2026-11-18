// Demo accounts (docs/design/scaffold-spec.md §7.6). They are created by the seeds of the `users`
// module (01-users, P1, task R01); until then they do not exist in the database.

export type Role = 'ADMIN' | 'USER';

export interface DemoUser {
  email: string;
  password: string;
  nickname: string;
  role: Role;
}

const user = (nickname: string): DemoUser => ({
  email: `${nickname}@sidequest.test`,
  password: 'Password123!',
  nickname,
  role: 'USER',
});

export const users = {
  admin: { email: 'admin@sidequest.test', password: 'Admin123!', nickname: 'admin', role: 'ADMIN' },
  alice: user('alice'),
  bob: user('bob'),
  carol: user('carol'),
  dave: user('dave'),
  erin: user('erin'),
} satisfies Record<string, DemoUser>;
