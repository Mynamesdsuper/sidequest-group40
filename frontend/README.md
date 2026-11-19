# SideQuest – frontend

Angular (standalone components, signals, SCSS, routing, no SSR) with **no UI component library**: every style is hand-written modern CSS (ADR 0006). Leaflet + OpenStreetMap for maps, `socket.io-client` for live updates.

## Commands

| Command | What it does |
|---|---|
| `npm ci` | install |
| `npm start` | dev server on http://localhost:4200 (the backend must run on :3000) |
| `npm run build` | production build in `dist/frontend/browser` |
| `npm run lint` | ESLint (typescript-eslint, angular-eslint, `local/feature-boundaries`) |
| `npm run typecheck` | TypeScript, no output |
| `npm test` | unit tests (Vitest through `ng test`) |
| `npm run test:lint-rules` | proves the `feature-boundaries` rule triggers (`node --test`) |
| `docker build -t sidequest-frontend .` | nginx image with the SPA fallback (used by `docker-compose.demo.yml`) |

## Layout of `src/`

| Path | Owner | Content |
|---|---|---|
| `environments/` | shared | `apiBaseUrl`, `socketUrl` (`environment.development.ts` replaces `environment.ts` in dev builds) |
| `styles/` + `styles.scss` | shared | design tokens (CSS custom properties, light/dark via `prefers-color-scheme`), reset, layout utilities, `.btn` / `.card` |
| `app/core/api/` | shared | `apiUrl()`, `Page<T>`, `ApiErrorBody`, `errorInterceptor` (errors become toasts; opt out with `SKIP_ERROR_TOAST`) |
| `app/core/layout/` | shared | the shell (top bar, side nav that becomes a drawer below 48rem, footer with the OSM credit on routes with `data.showsMap`), home page (calls `/health`), 404 page |
| `app/core/auth/` | P1 | `AuthService`, `authInterceptor`, `authGuard`, `adminGuard`: stubs, `TODO(R01, P1)` |
| `app/core/realtime/` | P2 | `RealtimeService`: stub, `TODO(R06A, P2)` |
| `app/shared/ui/` | shared | page header, empty state, spinner, confirm dialog (native `<dialog>`), toast service + container, error banner, form field, placeholder page |
| `app/features/<x>/` | see CODEOWNERS | `<x>.routes.ts` (lazy-loaded), `public-api.ts` |
| `app/app.routes.ts` | shared | written once: one lazy route per feature; add pages in the feature's own routes file |

## Rules

- A feature imports another feature **only** from its `public-api.ts` (ESLint `local/feature-boundaries`, see `eslint-rules/`).
- Every API call goes through `HttpClient` with `apiUrl(...)`; the interceptors add the token and show errors.
- Mobile first: every page must work at 360 px width.
- Leaflet: the CSS is in `angular.json`; the marker images are copied to `assets/leaflet/` (set `L.Icon.Default.imagePath = 'assets/leaflet/'`). Always show the OpenStreetMap attribution.
