# Kiln & Co.

A full e-commerce demo store for a fictional ceramics studio, built as a front-end portfolio piece.
_"Made slowly, used daily."_

> **Status:** Phase 1 of 10 is complete (tooling, design system, layout shell, `/styleguide`). The full README, with the live demo link, architecture and database diagrams, test card details and Lighthouse scores, is written in Phase 10.

## Stack so far

- **Next.js 16** (App Router, Cache Components, Turbopack), **React 19**, **TypeScript** (strict, `noUncheckedIndexedAccess`)
- **Tailwind CSS v4**: design tokens live in `src/app/globals.css` (`@theme`), mirrored as data in `src/styles/tokens.ts`
- **Radix UI** primitives, restyled to the brand, plus **Lucide** icons
- **Vitest** and **React Testing Library**; **ESLint**, **Prettier**, **Husky** and **lint-staged**

## Getting started

```bash
npm install
cp .env.example .env.local   # only NEXT_PUBLIC_SITE_URL is needed in Phase 1
npm run dev                  # http://localhost:3000
```

## Scripts

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the dev server                           |
| `npm run build`     | Production build                               |
| `npm run start`     | Serve the production build                     |
| `npm run lint`      | ESLint, zero warnings allowed                  |
| `npm run typecheck` | Generate Next route types, then `tsc --noEmit` |
| `npm test`          | Unit and component tests (Vitest)              |
| `npm run format`    | Prettier, including Tailwind class sorting     |

The pre-commit hook runs lint-staged (ESLint and Prettier on staged files), the type check and the unit tests.

## Design system

Visit `/styleguide` (not linked from the navigation). It shows every colour scale, the WCAG contrast ratio of every semantic colour pair in both themes, the type scale, spacing, radius, and every component in each of its states. The same contrast checks run as unit tests (`src/styles/tokens.test.ts`), and the tests fail if `globals.css` and `tokens.ts` drift apart.
