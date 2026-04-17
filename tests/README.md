# Hybrid Test Structure

Projekt koristi hibridni pristup:

- `unit` i `component` testovi stoje uz module koje testiraju (colocated).
- `tests/integration` je centralni folder za integration testove.
- `tests/e2e` je centralni folder za Playwright end-to-end testove.

## Pokretanje

- `npm run test` - svi Vitest testovi
- `npm run test:watch` - watch mod
- `npm run test:coverage` - coverage izvestaj
- `npm run test:e2e` - Playwright E2E testovi

## Napomena

Pre prvog pokretanja:
- instalirati dependencies iz `package.json`,
- kopirati `.env.test.example` u `.env.test` i popuniti vrednosti,
- obezbediti odvojenu test bazu.
