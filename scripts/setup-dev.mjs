// npm run setup:dev — one command to prepare a development machine (Windows, macOS, Linux):
// installs backend, frontend and e2e, downloads Chromium for Playwright, and creates the .env files
// from the .env.example templates when they are missing (existing .env files are never overwritten).
import { copyFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { ROOT } from './lib.mjs';

const run = (cmd, cwd) => {
  console.log(`\n> ${cmd}   (${path.relative(ROOT, cwd) || '.'})`);
  execSync(cmd, { cwd, stdio: 'inherit' });
};

for (const dir of ['backend', 'frontend', 'e2e']) run('npm ci', path.join(ROOT, dir));
run('npx playwright install chromium', path.join(ROOT, 'e2e'));

for (const dir of ['.', 'backend']) {
  const example = path.join(ROOT, dir, '.env.example');
  const env = path.join(ROOT, dir, '.env');
  if (existsSync(env)) {
    console.log(`kept      ${path.relative(ROOT, env)} (already exists)`);
  } else {
    copyFileSync(example, env);
    console.log(`created   ${path.relative(ROOT, env)} from .env.example`);
  }
}

console.log(`
Done. Next:
  1. Put a long random TOKEN_SECRET in backend/.env:
       node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  2. docker compose up -d db          (if 5432 is busy: DB_PORT in .env + the same port in backend/.env)
  3. cd backend && npm run db:migrate && npm run db:seed && npm run dev
  4. cd frontend && npm start         then open http://localhost:4200
`);
