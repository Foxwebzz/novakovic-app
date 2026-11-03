# Nikola Novaković · Aplikacije po meri

Prezentacioni sajt: Angular 21, statički prerender, three.js hero, Netlify Forms.

## Lokalno

```bash
npm install
npm start          # http://localhost:4200
npm test
npm run build      # izlaz: dist/novakovic-app/browser
```

## Deploy na Netlify

1. Netlify → Add new site → Import an existing project → GitHub → `novakovic-app`.
2. Podešavanja se čitaju iz `netlify.toml` (build: `npm run build`, publish: `dist/novakovic-app/browser`).
3. Posle prvog deploya: Site configuration → Forms → uključi detekciju formi, pa ponovo deployuj.
4. Forms → Form notifications → dodaj email obaveštenje za formu `upit`.

Kontakt forma lokalno ne može da pošalje poruku (radi tek na Netlify-ju).
