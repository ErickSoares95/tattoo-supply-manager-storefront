# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # dev server on http://localhost:3000
npm run build   # production build
npm run lint    # eslint (flat config, eslint-config-next)
```

There is no test runner configured. The app needs the Spring Boot backend ([tattoo-supply-manager](https://github.com/ErickSoares95/tattoo-supply-manager)) for anything beyond the static shell; point to it with `NEXT_PUBLIC_API_BASE_URL` (see `.env.example`, defaults to `http://localhost:8080`). Backend `CORS_ALLOWED_ORIGINS` must include the app's origin for client-side fetches (login, checkout, admin).

## Architecture

Next.js 16 App Router storefront (React 19, TypeScript, Tailwind v4) for a tattoo supply store. UI copy and routes are in Portuguese (`/produtos`, `/pedidos`, `/perfil`, `/favoritos`, `/registrar`). All real data comes from the Spring Boot API; there are no Next API routes.

**Data access** — `src/lib/api/*.ts` are thin per-resource modules over `apiFetch` in `client.ts` (throws `ApiError` with status; treats empty 2xx bodies as `undefined`). Auth tokens are passed explicitly as a `token` argument (not read from localStorage inside `apiFetch`) so the same functions work from Server Components and client components. Types live in `src/lib/api/types.ts`.

**Server vs. client split** — Public catalog pages (`/`, `/produtos`) are Server Components that fetch on the server, with filters/sort/pagination held in URL search params (`ProductCatalog` is shared by home and `/produtos`). Anything authenticated (orders, profile, admin, checkout) is a client component that gets the token from `useAuth()`.

**Client state** — Four context providers wrapped in `src/app/layout.tsx` (`AccessibilityProvider` → `AuthProvider` → `CartProvider` → `WishlistProvider`) in `src/lib/store/`. Auth, cart and wishlist persist to localStorage and hydrate in a `useEffect` after mount (to avoid hydration mismatches), which is why `useAuth()` exposes `isLoading`: guarded pages must wait for it to go false before redirecting to `/login`, or logged-in users get bounced. Accessibility context drives real font-size and high-contrast state.

**Admin** — `src/app/admin/layout.tsx` is the single client-side guard for the whole `/admin` subtree (redirects non-admins and renders nothing until authorized). Individual admin pages don't re-check roles; the backend enforces authorization too.

**Styling** — Design tokens (dark gold/black theme) are CSS custom properties in `src/app/globals.css`, mapped to Tailwind via `@theme inline`. Fonts (Cormorant Garamond, Inter) via `next/font` in the root layout.

**Product images** deliberately use plain `<img>` (`components/shop/ProductImage.tsx`), not `next/image`: URLs are admin-pasted from arbitrary hosts and can't fit a `remotePatterns` allowlist.

Known open items: home "Ofertas"/"Destaques" sections are mock data (the backend `Product` has no category/rating/badge fields); payment is a deterministic demo rule in the backend, not a real gateway.
