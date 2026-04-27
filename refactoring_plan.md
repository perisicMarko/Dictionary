  ## Design Refactor Blueprint For dictionary

  ### Summary

  Refactor toward a feature-oriented + layered architecture with clear boundaries: UI -> application services -> domain -> infrastructure (Prisma/external APIs).
  Primary optimization: maintainability. Rollout: phased migration with compatibility wrappers so existing pages keep working during transition.

  flowchart LR
    A[Next App Router pages/components] --> B[actions/* server actions]
    A --> C[app/api/* routes]
    B --> D[manageSession token utils]
    B --> E[manage* /db Prisma modules]
    C --> E
    E --> F[(PostgreSQL via Prisma)]
    B --> G[External APIs: dictionary + email]

  ### Current Architecture Blueprint (As-Is)

  1. UI is in app/(ui) and components, with heavy client-side components calling server actions directly.
  2. Business logic is concentrated in actions/*, but concerns are mixed:
      - auth/session checks
      - orchestration
      - DB access
      - response shaping
  3. Data access is duplicated across actions/*/db.ts, each creating its own new PrismaClient().
  4. Token/session workflow is spread across:
      - actions/manageSession
      - app/api/getAccessToken
      - many actions/manageNotes* functions repeating the same auth branches.
  5. Route guarding lives in proxy.ts with path lists and token checks.
  6. Operational/API jobs (app/api/dictionary/recall, restoreNotes, deleteUnverifiedUsers) are coupled to action/db modules without dedicated service boundaries.

  ### Target Structure + Interface Changes

  src/
    app/                      # Next routes only (RSC/client composition)
    features/
      auth/
      notes/
      drawers/
      schools/
      dictionary/
        ui/
        application/
        domain/
        infrastructure/
    shared/
      ui/
      lib/
      types/
    server/
      db/
        client.ts             # singleton Prisma
      auth/
        session.ts            # token issue/verify/refresh
      http/
        guards.ts             # reusable auth guards for actions/routes

  Important interface/type changes:

  1. Replace action return-shape drift ({success}, {status}, {accessToken} variants) with typed result envelope:
      - ActionResult<T> = { ok: true; data: T; token?: string } | { ok: false; code: string; message: string }.
  2. Introduce feature service interfaces (example):
      - NotesService.getUserNotes(userId, filter)
      - NotesService.saveNote(input)
      - RecallService.gradeNote(input)
  3. Centralize auth/session API:
      - requireUserContext() for actions/routes
      - refreshAccessTokenIfNeeded() used once in shared guard.
  4. Consolidate shared types:
      - split DB models vs UI view models (NoteEntity, NoteView, DrawerView) and stop leaking Prisma-shaped objects to client.
  5. Add repository interfaces per aggregate (NotesRepository, UsersRepository, DrawersRepository) so business logic is DB-agnostic.

  ### Design Improvements (Codebase Standards)

  1. Naming consistency: move from mixed GetNotes/getUsersNotes to single convention (camelCase functions, noun-based modules).
  2. Error handling policy:
      - no silent console.log fallthroughs in repositories/services
      - typed domain errors mapped once at action/route boundary.
  3. Remove commented production toggles and hardcoded school/subscription values; replace with config-driven feature flags.
  4. Minimize client token orchestration in TokenContextProvider; shift to server-first session validation and explicit refresh endpoint contract.
  5. Establish dependency direction rule:
      - ui -> application -> domain -> infrastructure
      - forbid reverse imports via ESLint boundaries.

  ### Phased Migration Plan

  1. Foundation phase:
      - create server/db/client.ts Prisma singleton.
      - create shared auth guard utilities.
      - define ActionResult<T> and domain error map.
  2. Vertical slice phase (Notes + Recall first):
      - extract notes service + repository.
      - migrate actions/manageNotes to thin handlers delegating to service.
      - keep old action names as wrappers to avoid UI breakage.
  3. Drawers phase:
      - repeat extraction pattern for drawers.
      - deduplicate auth/token branch logic via shared guard.
  4. Auth/School phase:
      - extract subscription/auth flows into services.
      - remove production comments/hardcoded behavior behind config flags.
  5. API route phase:
      - move app/api/* jobs to feature services and shared infra modules.
  6. Cleanup phase:
      - remove legacy actions/*/db.ts duplication.
      - enforce module boundaries and naming standards in lint rules.

  ### Test Plan

  1. Unit tests:
      - spaced repetition calculation
      - auth guard behavior (valid, expired access, expired refresh, unauthorized)
      - notes/drawers service invariants.
  2. Integration tests:
      - sign up/log in/log out flows
      - drawer CRUD and note assignment.
      - school platform key generation + student/subscription pages.
