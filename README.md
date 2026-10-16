# Vanessa Gazanez Tattoo — Supply Store (storefront redesign)

Next.js (App Router) rewrite of the [`tattoo-supply-manager-frontend`](https://github.com/ErickSoares95/tattoo-supply-manager-frontend)
MVP, following the mockup in `posts e dicas/layout/vanessa-gazanez-tattoo-mockup.html` (dark gold/black
theme, hero carousel, mega menu, real catalog with filters/pagination, cart drawer,
accessibility controls) — consuming the [tattoo-supply-manager](https://github.com/ErickSoares95/tattoo-supply-manager)
Spring Boot API for every real piece of data (products, orders, users, auth).

## Live demo

**https://tattoo-supply-manager-storefront.vercel.app**

Demo accounts (same seed as the backend, `docker/seed-demo-data.sql`):

| Role  | Email             | Password        |
|-------|-------------------|------------------|
| Admin | admin@demo.com    | Demo@Admin123    |
| Client| client@demo.com   | Demo@Client123   |

The admin account also unlocks `/admin` — product/user CRUD and failed-notification
reprocessing, in the same visual system as the storefront itself.

## Why a new repo, why Next.js

The old MVP (React + Vite) stayed deployed and untouched while this was built — the demo link only
moved here once this repo reached feature parity plus the new visual design (see below). Next.js over
Vite specifically for:

- **Real SEO** — the store needs to actually show up in Google, which a pure client-rendered SPA
  doesn't do well.
- **Native image optimization** — `next/image` for the product catalog instead of hand-rolled
  `<img>` handling (product photos themselves use a plain `<img>` on purpose, though — see
  `components/shop/ProductImage.tsx` for why: the URL is admin-pasted from an arbitrary host, and
  `next/image` needs a `remotePatterns` domain allowlist that doesn't fit that).
- **A natural path to a real backend later** — API routes / Server Actions, without a stack swap
  if the product catalog or checkout ever needs server-side logic that doesn't belong in the
  Spring Boot API.

## Redesign steps — all 6 shipped

1. **Foundation** — Next.js setup, design tokens ported from the mockup, layout shell (Header,
   department bar, Footer), skip link + focus-visible baked in from day one.
2. **Home** — hero carousel + "Ofertas do dia"/"Destaques" sections (still mock data — the real
   `Product` model has no category/rating/badge fields to back a curated homepage yet, a
   deliberately open item, not an oversight).
3. **Real catalog** — `/produtos` with filters (name, price range, in-stock only), sorting and
   pagination, wired to the real `GET /products` (public since backend `#034`).
4. **Product page + cart** — `/produto/[id]` + a cart drawer wired to `POST /orders`.
5. **Logged-in area** — login (email *or* CPF, matching the backend), register, order history, and
   a full **admin panel** (`/admin`) — product CRUD, user CRUD (role/status), notification
   reprocessing — ported from the MVP's admin pages into this visual system.
6. **Accessibility + responsiveness + deploy** — real font-size (A+/A-) and high-contrast controls
   (not decorative — they toggle actual state via `AccessibilityContext`), a mobile-specific header
   layout (the desktop logo + search + account controls don't all fit under ~400px, so mobile gets
   a trimmed logo and a dedicated search row instead of silently overflowing), and the Vercel
   deployment linked above.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (design tokens registered as
CSS custom properties in `src/app/globals.css`, mapped into Tailwind via `@theme inline`).

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the Spring Boot backend (e.g. `https://tattoo-supply-manager.onrender.com`). Defaults to `http://localhost:8080` for local dev. |

Login and every authenticated call go through the storefront's own `/api/*` routes (see
**Authentication** below), so they don't depend on CORS. The backend's `CORS_ALLOWED_ORIGINS` still
needs this deployment's origin for the one call the browser makes directly (registration);
server-rendered pages like `/produtos` aren't affected, since that fetch never leaves the Vercel server.

## Authentication (BFF)

The backend's JWT never reaches the browser's JavaScript, so an XSS bug can't steal it:

- `POST /api/auth/login` calls the backend and stores the JWT in an **HttpOnly, SameSite=Lax**
  cookie on the storefront's origin; the response body only carries the profile.
- Client components call `/api/backend/<path>`, a same-origin proxy that adds
  `Authorization: Bearer <jwt>` from the cookie and relays the backend's answer unchanged. It
  rejects cross-origin POST/PUT/PATCH/DELETE and clears the cookie when the backend answers 401.
- `POST /api/auth/logout` deletes the cookie.

Why not a cookie set by the API itself: the storefront (`vercel.app`) and the API (`onrender.com`)
are different sites, so that cookie would be third-party and blocked by modern browsers.

## Getting started

```bash
npm install
npm run dev
npm test      # Vitest unit tests (BFF routes, api client, auth context)
```

Open [http://localhost:3000](http://localhost:3000). Needs the backend running (locally or pointed at
the deployed one via `NEXT_PUBLIC_API_BASE_URL`) for anything beyond the static shell.

## In the open

- No E2E tests yet (Playwright would cover login → checkout → payment); unit tests cover the BFF.
- No real payment gateway — checkout calls the backend's `payment` module, whose approval rule is
  deterministic for demo purposes, not wired to Pix/card.
- Custom domain not set up yet — running on the default `.vercel.app` one.
