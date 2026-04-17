# Test Plan - Dictionary App

## 1. Cilj i obim

Ovaj plan pokriva testiranje celog projekta:
- korisnicki deo aplikacije (`(ui)`),
- school/platform deo (`(si)`),
- server actions (`actions/*`),
- API route-ove (`app/api/*`),
- auth/session/token logiku,
- Prisma/PostgreSQL sloj.

Plan je organizovan po modulima i po tipu testova:
- `Unit` - izolovana logika,
- `Integration` - povezani delovi (actions + DB + auth + API),
- `Component` - React komponente sa interakcijama,
- `E2E` - kriticni tokovi kroz browser.

## 2. Predlozeni alati

- Test runner: `Vitest`
- React testiranje: `@testing-library/react`, `@testing-library/user-event`
- Mock server/API: `MSW`
- E2E: `Playwright`
- Coverage: `@vitest/coverage-v8`
- Integration DB: test PostgreSQL baza ili `testcontainers`

## 3. Test okruzenja

- `.env.test` sa odvojenim vrednostima:
  - `DATABASE_URL`, `DIRECT_URL` (test baza),
  - `ACCESS_SECRET`, `REFRESH_SECRET`,
  - `EMAIL_USER`, `EMAIL_PASS` (mock/fake u testu),
  - `API_KEY` (mock scenariji).
- Testovi ne smeju koristiti produkcionu bazu.
- Baza se resetuje pre test suite-a (migrations + seed po potrebi).

## 4. Plan po modulima

## 4.1 Auth i session (`actions/auth/*`, `actions/manageSession/*`, `proxy.ts`, `/api/getAccessToken`)

### Unit
- `encryptAccess` / `decryptAccess`: validan token, nevalidan token, istek.
- `encryptRefresh` / `decryptRefresh`: validan refresh, nevalidan refresh.
- `verifySession`: vraca `UNAUTHORIZED`, `VALID_ACCESS`, `ACCESS_NEEDED`.
- Zod validacije (`SignUpSchema`, `LogInSchema`, `SchoolSignUpSchema`, `GenerateSchema`).

### Integration
- `authenticateSignUp`:
  - uspeh i kreiranje user-a,
  - email vec postoji,
  - invalid input.
- `authenticateLogIn`:
  - pogresan email/password,
  - neproveren email,
  - uspesan login i postavljanje refresh cookie-ja.
- School auth:
  - school login uspeh/fail,
  - school signup sa/bez partnerstva.
- `/api/getAccessToken`:
  - bez refresh tokena -> 401,
  - validan refresh -> vraca access token,
  - session expiring signal.
- `proxy.ts`:
  - redirect kada nije autentifikovan,
  - dozvoljen pristup kada jeste,
  - pogresna ruta unutar zasticenih delova.

### E2E
- Login/logout korisnika.
- Redirect sa javnih ruta na `/dictionary/inputWord` kada je user ulogovan.
- Redirect na `/` kada token vise nije validan.

## 4.2 Dictionary API i reci (`actions/manageDictApi/*`, `actions/manageWords/*`)

### Unit
- `reformatApiNotes` mapiranje:
  - phonetics sa audio,
  - bez audio,
  - meanings/definitions fallback vrednosti.

### Integration
- `fetchApiNotes`:
  - rec postoji u bazi -> vraca cache,
  - rec ne postoji -> poziva dictionary API (MSW),
  - fallback na VoiceRSS kada nema audio iz dictionary API.
- Error handling kada eksterni API vrati gresku/timeout.

### E2E
- Unos nove reci i prikaz rezultata.

## 4.3 Notes i spaced repetition (`actions/manageNotes/*`, `app/api/dictionary/recall/route.ts`, `/api/restoreNotes`)

### Unit
- `spacedRepetition.calc`:
  - quality >= 3 grane,
  - quality < 3 reset,
  - minimalni `easeFactor` = 1.3.

### Integration
- `saveNotes`:
  - valid access,
  - ACCESS_NEEDED (refresh -> novi access),
  - UNAUTHORIZED.
- `getUsersNotes` / `getUsersHistory`:
  - filtriranje po `status`,
  - samo note ulogovanog user-a.
- `getRecallNotes`:
  - vraca samo due note (`review_date < now`).
- `updateReviewDate`:
  - menja `days/repetitions/ease_factor/review_date`.
- `setAsLearned`, `editNote`, `backToRecallSystem`, `deleteNote`:
  - uspesan update i auth fallback scenariji.
- Drawer operacije:
  - create/update/delete drawer,
  - add/remove note iz drawer-a.
- `/api/dictionary/recall`:
  - salje mail za due note (mock nodemailer).
- `/api/restoreNotes`:
  - dodaje audio URL za note bez audio.

### Component
- `Recall` ekran:
  - prikaz note,
  - submit grade,
  - refresh liste.
- `YourWords`:
  - switch `Drawers/Notes`,
  - render praznog stanja.

### E2E
- Tok: input word -> save -> recall -> grade -> promena dostupnih recall notes.
- Tok: set as learned -> pojavljuje se u history.

## 4.4 School platform (`actions/manageSchools/*`, `actions/manageUsers/*`, `app/(si)/school/platform/*`)

### Unit
- Validacija email/date ulaza za generisanje activation key.

### Integration
- `generateActivationKey`:
  - validan kurs,
  - kurs duzi od dozvoljenog,
  - datum u proslosti,
  - insert/update subscription.
- `getSubscriptionsBySchool`, `updateSubscriptionEmail`.
- `getUsersBySchool` i mapiranje student DTO-a.

### Component
- `students/page.tsx`:
  - search po imenu/email-u,
  - sort/filter (active/expired, asc/desc).
- `subscriptions/page.tsx`:
  - search/filter/sort,
  - rerender nakon izmene child komponente.

### E2E
- School login -> students list -> subscriptions list -> generate key flow.

## 4.5 UI zajednicke komponente (`components/*`, `app/(ui)/*`)

### Component
- `NavBar`:
  - prikaz ruta po path-u,
  - mobile toggle open/close,
  - logout akcija.
- `TokenContextProvider`:
  - periodicni fetch access tokena,
  - session expiring modal,
  - redirect na 401.
- `SaveNoteForm`, `GradeForm`, `SearchBar`, `DisplayNotes`:
  - osnovne interakcije i callback-ovi.

### E2E
- Landing -> login/signup navigacija.
- Forgot/reset password flow (happy + invalid token path).

## 5. Prioriteti implementacije

## Faza 1 (kriticno)
- Unit: `spacedRepetition`, Zod validacije, token helperi.
- Integration: auth login/signup, `saveNotes`, `getRecallNotes`, `updateReviewDate`, `proxy` redirect.
- E2E: login + core dictionary flow (input/save/recall).

## Faza 2 (visok prioritet)
- Integration: school generate key + subscriptions/students fetch.
- Component: `NavBar`, `TokenContextProvider`, `Recall`, `YourWords`.
- E2E: school platform glavni tokovi.

## Faza 3 (stabilizacija)
- API background route testovi (`restoreNotes`, mail recall).
- Dodatni edge case i error scenario testovi.
- Coverage gate.

## 6. Coverage ciljevi

- Globalno: minimum `80%` lines/statements.
- Kriticni moduli (`auth`, `manageSession`, `manageNotes/spacedRepetition`, `proxy.ts`): minimum `90%`.
- E2E: pokrivenost svih kriticnih user tokova (ne kroz procenat, vec kroz checklist-u).

## 7. Predlog strukture testova (hibridno)

```txt
actions/
  manageSession/
    manageSession.test.ts
  manageNotes/
    spacedRepetition.test.ts
components/
  NavBar.test.tsx
app/
  (ui)/dictionary/recall/
    page.test.tsx
tests/
  integration/
    auth/
    notes/
    schools/
    api/
  e2e/
    auth.spec.ts
    dictionary-flow.spec.ts
    school-flow.spec.ts
```

## 8. CI predlog

- Pipeline koraci:
  1. Install dependencies
  2. Prisma generate + migrate na test bazi
  3. Unit + Integration + Component testovi
  4. E2E testovi (headless)
  5. Coverage report i fail ispod praga

## 9. Definicija "done"

- Svi testovi iz Faze 1 prolaze u CI.
- Nema flaky testova u 3 uzastopna CI run-a.
- Coverage prag ispunjen.
- Kriticni tokovi (user i school) pokriveni E2E testovima.
