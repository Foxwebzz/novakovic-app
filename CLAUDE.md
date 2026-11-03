# Project: novakovic-app

Prezentacioni sajt „Nikola Novaković · Aplikacije po meri“. Cilj: firme koje rade u Excelu da pošalju upit. Jezik sajta: srpski (latinica).

## Stack

- Angular 21 (standalone components, signals, zoneless)
- Prerender (SSG): `outputMode: "static"`, bez Node servera; hosting na Netlify
- Styling: SCSS, tokeni u `src/styles/_tokens.scss`, breakpointi u `src/styles/_breakpoints.scss`
- 3D: three.js (samo hero, lazy import u pregledaču)
- Font: Schibsted Grotesk (self-hosted, `@fontsource-variable`)
- Testovi: Vitest (`ng test`)
- Node 22, npm

## Komande

- `npm start`: dev server (http://localhost:4200)
- `npm run build`: production build + prerender → `dist/novakovic-app/browser`
- `npm test`: unit testovi

Pre završetka svakog taska pokreni `test` i `build`. Oba moraju da prođu.

## Struktura

- `src/app/core/`: servisi (npr. `ContactService` za Netlify Forms)
- `src/app/shared/`: header, footer, kontakt podaci (`contact-info.ts`)
- `src/app/features/home/<sekcija>/`: sekcije početne strane
- `public/media/`: snimci i slike aplikacija (isečeni iz demo videa)

## Konvencije

- Samo standalone komponente, bez NgModule.
- `ChangeDetectionStrategy.OnPush` na svim komponentama.
- `inject()` umesto constructor injection-a.
- Signals i `computed()` za state.
- Novi control flow (`@if`, `@for` sa `track`).
- `input()` / `output()` funkcije umesto dekoratora.
- Bez `any`; strict TypeScript.
- Imena fajlova: `kebab-case.component.ts`.

## Stilovi i dizajn

- Koristi CSS varijable iz tokena, ne hardkodovane boje i razmake.
- U komponentama: `@use 'breakpoints' as bp;` (ne uvozi `tokens`, to bi dupliralo `:root`).
- Mobile-first; breakpointi 640 / 1024 / 1280.
- Boje: teget `--c-ink` #0f2236, zelena `--c-green-bright` #2fc47a (na tamnom) i `--c-green` #18834c (na svetlom), svetla podloga `--c-paper`.
- Animacije štedljivo: jedan glavni trenutak (hero scena). Bez fade-in efekata na svakoj sekciji.

## Pristupačnost (obavezno)

- WCAG 2.2 AA.
- Semantički HTML pre ARIA; sve radi tastaturom; vidljiv focus.
- `prefers-reduced-motion`: hero je statičan, snimci se ne puštaju sami.
- Slike imaju `alt`.

## Performanse / SSR

- Bez direktnog pristupa `window`/`document` van `afterNextRender`.
- three.js se učitava dinamičkim importom i pauzira kad hero nije vidljiv.
- `NgOptimizedImage` za slike, `@defer` za sadržaj ispod fold-a.

## Kontakt forma

- Netlify Forms, forma `upit`. Skrivena forma u `src/index.html` služi da je Netlify prepozna; nazivi polja moraju da se poklapaju sa `ContactService`.

## Ne diraj

- Ne dodaji nove npm pakete bez pitanja.
- Ne menjaj `angular.json` i `netlify.toml` bez pitanja.

## Git

- Conventional commits (`feat:`, `fix:`, `refactor:` ...).
