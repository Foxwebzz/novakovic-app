# Project: <Novakovic-app>

## Stack

- Angular <verzija> (standalone components, signals)
- SSR: <@angular/ssr da/ne>
- Styling: <SCSS / Tailwind / Angular Material>
- State: <signals / NgRx / servis + signals>
- Testovi: <Jest / Karma / Vitest>, e2e: <Playwright / Cypress>
- Node <verzija>, package manager: <npm / pnpm>

## Komande

- `npm start`: dev server (http://localhost:4200)
- `npm run build`: production build
- `npm test`: unit testovi
- `npm run lint`: ESLint
- `npm run e2e`: e2e testovi

Pre završetka svakog taska pokreni `lint`, `test` i `build`. Sva tri moraju da prođu.

## Struktura

- `src/app/core/`: singleton servisi, interceptori, guardovi
- `src/app/shared/`: reusable komponente, pipe-ovi, direktive
- `src/app/features/<feature>/`: lazy-loaded feature rute
- `src/environments/`: konfiguracija po okruženju

## Konvencije

- Samo standalone komponente, bez NgModule.
- `ChangeDetectionStrategy.OnPush` na svim komponentama.
- `inject()` umesto constructor injection-a.
- Signals i `computed()` za lokalni state; RxJS samo za async tokove (HTTP, eventovi).
- Novi control flow (`@if`, `@for` sa `track`), ne `*ngIf`/`*ngFor`.
- `input()` / `output()` funkcije umesto dekoratora.
- Bez `any`; strict TypeScript.
- Imena fajlova: `kebab-case.component.ts`, jedna komponenta po fajlu.
- Generiši preko CLI: `ng g c features/<x>/<ime>`.

## Stilovi i dizajn

- Design tokeni su u `src/styles/_tokens.scss`. Koristi njih, ne hardkodovane boje i razmake.
- Mobile-first; breakpointi: <npr. 640 / 1024 / 1280>.
- Font: <naziv>; boje: <primarna, sekundarna>.

## Pristupačnost (obavezno)

- WCAG 2.2 AA.
- Semantički HTML pre ARIA; svaki interaktivni element radi sa tastaturom.
- Vidljiv focus state; kontrast najmanje 4.5:1.
- Slike imaju `alt`; ikonice-dugmad imaju `aria-label`.

## Performanse / SSR

- Lazy load za sve feature rute.
- `NgOptimizedImage` za slike.
- `@defer` za sadržaj ispod fold-a.
- Bez direktnog pristupa `window`/`document`; koristi `isPlatformBrowser` ili `afterNextRender`.

## Ne diraj

- `<npr. src/app/legacy/>`: ne refaktorisati bez pitanja.
- Ne dodaji nove npm pakete bez pitanja.
- Ne menjaj `angular.json` i CI konfiguraciju bez pitanja.

## Git

- Conventional commits (`feat:`, `fix:`, `refactor:` ...).
- Mali, fokusirani PR-ovi.
