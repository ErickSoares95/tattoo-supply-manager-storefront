# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # dev server on http://localhost:3000
npm run build   # production build
npm run lint    # eslint (flat config, eslint-config-next)
```

```bash
npm test        # vitest run (unit tests: BFF route logic, api client, AuthContext)
npm run test:watch
```

Tests live next to the code (`src/**/*.test.ts(x)`), jsdom by default; server-side tests start with `// @vitest-environment node`. The app needs the Spring Boot backend ([tattoo-supply-manager](https://github.com/ErickSoares95/tattoo-supply-manager)) for anything beyond the static shell; point to it with `NEXT_PUBLIC_API_BASE_URL` (see `.env.example`, defaults to `http://localhost:8080`; also read server-side by the BFF route handlers). Backend `CORS_ALLOWED_ORIGINS` must include the app's origin only for the calls the browser still makes directly (registration).

## Architecture

Next.js 16 App Router storefront (React 19, TypeScript, Tailwind v4) for a tattoo supply store. UI copy and routes are in Portuguese (`/produtos`, `/pedidos`, `/perfil`, `/favoritos`, `/registrar`). All real data comes from the Spring Boot API; there are no Next API routes.

**Auth (BFF)** — the backend JWT never reaches JavaScript. `POST /api/auth/login` (`src/lib/server/login.ts`) calls the backend, stores the token in the HttpOnly, `SameSite=Lax` cookie `tsm_session` (lifetime = the token's `exp`) and returns only the profile fields. Authenticated calls go to the same-origin catch-all `src/app/api/backend/[...path]/route.ts` (`src/lib/server/proxy.ts`), which adds `Authorization: Bearer` from the cookie, rejects cross-origin state-changing requests, relays status and body unchanged, and clears the cookie on a backend 401. `POST /api/auth/logout` deletes the cookie. Storefront and API are on different sites (vercel.app / onrender.com), so a cookie set by the API itself would be third-party and blocked by browsers - that is why the cookie lives on the storefront's origin.

**Data access** — `src/lib/api/*.ts` are thin per-resource modules over `client.ts` (throws `ApiError` with status and the backend's `message`; treats empty 2xx bodies as `undefined`): `apiFetch` for public backend endpoints (catalog, registration; works in Server Components), `bffFetch` for authenticated ones through the proxy (no token argument anywhere), `sessionFetch` for `/api/auth/*`. Types live in `src/lib/api/types.ts`.

**Server vs. client split** — Public catalog pages (`/`, `/produtos`) are Server Components that fetch on the server, with filters/sort/pagination held in URL search params (`ProductCatalog` is shared by home and `/produtos`). Anything authenticated (orders, profile, admin, checkout) is a client component that checks `useAuth().isAuthenticated` and calls `bffFetch`-based functions; a 401 means the session expired and the page calls `logout()`.

**Client state** — Four context providers wrapped in `src/app/layout.tsx` (`AccessibilityProvider` → `AuthProvider` → `CartProvider` → `WishlistProvider`) in `src/lib/store/`. The cached user profile (never the token; a legacy `token` key is deleted and forces a new login), cart and wishlist persist to localStorage and hydrate in a `useEffect` after mount (to avoid hydration mismatches), which is why `useAuth()` exposes `isLoading`: guarded pages must wait for it to go false before redirecting to `/login`, or logged-in users get bounced. Accessibility context drives real font-size and high-contrast state.

**Admin** — `src/app/admin/layout.tsx` is the single client-side guard for the whole `/admin` subtree (redirects non-admins and renders nothing until authorized). Individual admin pages don't re-check roles; the backend enforces authorization too.

**Styling** — Design tokens (dark gold/black theme) are CSS custom properties in `src/app/globals.css`, mapped to Tailwind via `@theme inline`. Fonts (Cormorant Garamond, Inter) via `next/font` in the root layout.

**Product images** deliberately use plain `<img>` (`components/shop/ProductImage.tsx`), not `next/image`: URLs are admin-pasted from arbitrary hosts and can't fit a `remotePatterns` allowlist.

Known open items: payment is a deterministic demo rule in the backend, not a real gateway; no E2E tests yet (Playwright would cover login → checkout → payment). The home page is the full catalog (the old fixed "Ofertas"/"Destaques" sections were removed); `Product` has `category`, `onDeal` and `unitsSold` on the backend.
