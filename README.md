# Vanessa Gazanez Tattoo — Supply Store (storefront redesign)

Next.js (App Router) rewrite of the [`tattoo-supply-manager-frontend`](https://github.com/) MVP,
following the mockup in `posts e dicas/layout/vanessa-gazanez-tattoo-mockup.html` (dark gold/black
theme, hero carousel, mega menu, real catalog with filters/pagination, cart drawer,
accessibility controls).

## Why a new repo, why Next.js

The current MVP (React + Vite) stays deployed and untouched while this is built — swapping the
demo link happens only once this reaches feature parity plus the new visual design. Next.js over
Vite specifically for:

- **Real SEO** — the store needs to actually show up in Google, which a pure client-rendered SPA
  doesn't do well.
- **Native image optimization** — `next/image` for the product catalog instead of hand-rolled
  `<img>` handling.
- **A natural path to a real backend later** — API routes / Server Actions, without a stack swap
  if the product catalog or checkout ever needs server-side logic that doesn't belong in the
  Spring Boot API.

## Redesign steps (each one its own deliverable)

1. **Foundation** (this step) — Next.js setup, design tokens ported from the mockup, layout shell
   (Header, department bar, Footer), no functionality yet.
2. Home — hero carousel + "Ofertas do dia"/"Destaques" sections (mock data initially).
3. Real catalog — `/produtos` with filters/sorting/pagination, connected to the real API.
4. Product page + cart — `/produto/[slug]` (doesn't exist in the MVP) + cart wired to
   `POST /orders`.
5. Logged-in area in the new visual — login/register/my orders/admin panel.
6. Accessibility + responsiveness + deploy.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (design tokens registered as
CSS custom properties in `src/app/globals.css`, mapped into Tailwind via `@theme inline`).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
