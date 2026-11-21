# Kiln & Co.

A full e-commerce demo store for a fictional ceramics studio, built as a front-end portfolio piece.
_"Made slowly, used daily."_

> **Status:** Phases 1–2 of 10 are complete: tooling, design system, layout shell, `/styleguide`, and the Supabase schema with RLS, types and seed script. The full README, with the live demo link, architecture and database diagrams, test card details and Lighthouse scores, is written in Phase 10.

## Stack so far

- **Next.js 16** (App Router, Cache Components, Turbopack), **React 19**, **TypeScript** (strict, `noUncheckedIndexedAccess`)
- **Tailwind CSS v4**: design tokens live in `src/app/globals.css` (`@theme`), mirrored as data in `src/styles/tokens.ts`
- **Radix UI** primitives, restyled to the brand, plus **Lucide** icons
- **Supabase**: Postgres, Auth, Storage and Row Level Security; SQL migrations in `supabase/migrations`
- **Zod** for environment and input validation
- **Vitest** and **React Testing Library**; **PGlite** runs the real migrations in tests; **ESLint**, **Prettier**, **Husky** and **lint-staged**

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev                  # http://localhost:3000
```

### Database setup (one time)

1. Create a free project at [supabase.com](https://supabase.com).
2. Fill in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY` from **Project Settings → API Keys**
   - `SUPABASE_DB_URL`: **Connect → Session pooler** URI, with your database password filled in
   - `PEXELS_API_KEY`: free from [pexels.com/api](https://www.pexels.com/api/)
   - `SEED_OWNER_ADMIN_PASSWORD` and `SEED_DEMO_ADMIN_PASSWORD`: passwords of your choice, at least 10 characters
3. Run:

```bash
npm run db:push       # apply migrations: tables, RLS, functions, storage bucket
npm run db:types      # regenerate src/types/database.ts from the live schema
npm run seed:photos   # choose product photos from Pexels → src/data/photos.json (commit it)
npm run seed          # upload photos and load the demo store (safe to re-run)
```

`npm run seed` resets the catalogue, orders, reviews and inbox to a known demo state. Auth accounts are kept; the two admin passwords are re-synced from `.env.local`.

## Scripts

| Script                | What it does                                                    |
| --------------------- | --------------------------------------------------------------- |
| `npm run dev`         | Start the dev server                                            |
| `npm run build`       | Production build                                                |
| `npm run start`       | Serve the production build                                      |
| `npm run lint`        | ESLint, zero warnings allowed                                   |
| `npm run typecheck`   | Generate Next route types, then `tsc --noEmit`                  |
| `npm test`            | Unit, component and database tests (Vitest + PGlite)            |
| `npm run format`      | Prettier, including Tailwind class sorting                      |
| `npm run db:push`     | Apply `supabase/migrations` to the project in `SUPABASE_DB_URL` |
| `npm run db:types`    | Regenerate database types from the live schema                  |
| `npm run seed:photos` | Pick product photos from the Pexels API                         |
| `npm run seed`        | Load the demo catalogue, accounts, orders and reviews           |

The pre-commit hook runs lint-staged (ESLint and Prettier on staged files), the type check and the tests.

## Database

- **Money** is stored as integer cents; **order numbers** look like `KC-10001`.
- **Row Level Security** is on for every table. Shoppers see published products and approved reviews; customers see and edit only their own profile, addresses, cart, wishlist and orders. Admins write the catalogue and orders. The **demo admin** can read everything an admin can, but every write is rejected by the database.
- **Checkout fulfilment** (`fulfil_checkout`) runs in one transaction: it records the Stripe event (so a re-delivered webhook can't create a second order), creates the order with snapshot line items, decrements stock without ever going below zero (flagging any shortfall on the order timeline), and counts the discount use.
- **Reviews** can only be written by customers who bought the product, are marked verified automatically, and wait for moderation.
- `supabase/tests` runs every migration in PGlite (WebAssembly Postgres) and checks these rules as each role: 28 tests, no Docker needed.

## Design system

Visit `/styleguide` (not linked from the navigation). It shows every colour scale, the WCAG contrast ratio of every semantic colour pair in both themes, the type scale, spacing, radius, and every component in each of its states. The same contrast checks run as unit tests (`src/styles/tokens.test.ts`), and the tests fail if `globals.css` and `tokens.ts` drift apart.
