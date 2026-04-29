# Frontend Refactoring Plan

## Goal

Simplify frontend logic, reduce unnecessary client-side state/effects, and move rendering to the server wherever that is realistically possible in the current Next.js App Router architecture.

## Core Direction

The frontend should move toward a server-first structure:

- `page.tsx` should be a Server Component by default.
- Data fetching should happen on the server whenever possible.
- Client Components should be used only for interaction-heavy UI:
  - local form state
  - menus/dropdowns
  - Framer Motion usage
  - `window` / `document` / `sessionStorage`
  - router navigation after client-triggered actions

This means the frontend should stop using client pages as fetch-on-mount containers and instead use a split like:

1. Server page fetches data.
2. Server page passes initial data into a small Client Component.
3. Client Component handles only search/sort/toggles/animations/mutations.

## Main Problems In Current Frontend

### 1. Data fetching in `useEffect`

Several pages still fetch their main data on mount with `useEffect`, which is an older client-side pattern and wastes App Router SSR capabilities.

Current examples:

- `src/app/(ui)/dictionary/history/page.tsx`
- `src/app/(ui)/dictionary/recall/page.tsx`
- `src/app/(si)/school/platform/students/page.tsx`
- `src/app/(si)/school/platform/subscriptions/page.tsx`
- `src/app/(ui)/signup/[token]/page.tsx`
- `src/app/(ui)/resetPassword/[token]/page.tsx`

### 2. Overuse of `useEffect`

`useEffect` is currently used for:

- initial data fetching
- verification/token checks
- refresh toggles
- state synchronization that should be derived directly or handled on the server

This creates more client complexity than necessary.

### 3. Boolean rerender triggers

Patterns like these should be reduced:

- `refresh`
- `rerenderFromChild`

These are usually signs of client-managed refetch loops and can often be replaced by:

- `router.refresh()`
- server-rendered fresh data
- local optimistic updates when appropriate

### 4. Token pages are doing server work on the client

Verification and reset-token pages currently:

- read params on the client
- fetch token-bound user data in `useEffect`
- compute validity on the client
- trigger side effects from the client

This is the wrong execution side for that logic.

## Refactoring Principles

### 1. Server by default

Every page should first be evaluated with this rule:

- can this page render on the server and pass only interactive pieces to the client?

If yes, make the page a Server Component.

### 2. Client only where necessary

Keep Client Components only for:

- Framer Motion
- `useState`
- `useEffect` when truly required for browser APIs
- `useTransition`
- `useActionState`
- dropdowns/menus/modals
- keyboard listeners
- scroll listeners
- `sessionStorage` / `window` / `document`

### 3. Separate data loading from interaction

Prefer this shape:

- `page.tsx` -> server data loading
- `SomethingClient.tsx` -> search/filter/animation/interactions

### 4. Prefer derived state over effect-managed state

If something can be computed during render, do not put it into `useEffect`.

### 5. Prefer server validation for route/token-driven pages

If a page is driven by URL params and server data, it should usually be rendered and validated on the server.

## Best SSR Targets

### Highest-priority targets

#### 1. Signup verification token page

File:

- `src/app/(ui)/signup/[token]/page.tsx`

Problems:

- client-only page
- token parsing on client
- user fetch in `useEffect`
- verification effect without dependency array
- validity computed on client

Refactor target:

- make page a Server Component
- read `params.token` on server
- fetch user on server
- validate token on server
- verify account on server exactly once when valid
- render success/invalid state directly

#### 2. Reset password token page

File:

- `src/app/(ui)/resetPassword/[token]/page.tsx`

Problems:

- client fetch in `useEffect`
- token validity computed on client
- loading state exists only because of client fetch

Refactor target:

- make page a Server Component
- read token on server
- fetch user on server
- validate token on server
- render `ChangePasswordForm` only when valid
- remove client loading/fetch lifecycle

#### 3. School students page

File:

- `src/app/(si)/school/platform/students/page.tsx`

Problems:

- data fetched on mount with `useEffect`
- page made fully client-side only for search/filter

Refactor target:

- fetch students on server
- pass initial students into a Client Component
- keep search/filter UI client-side only

#### 4. School subscriptions page

File:

- `src/app/(si)/school/platform/subscriptions/page.tsx`

Problems:

- data fetched on mount with `useEffect`
- rerender toggle used to refetch

Refactor target:

- fetch subscriptions on server
- keep filtering/search in client child
- replace rerender toggles with `router.refresh()` or server refresh flow after mutations

## Next-priority SSR Targets

#### 5. History page

File:

- `src/app/(ui)/dictionary/history/page.tsx`

Problems:

- `useEffect` fetch on mount
- page-level loading state only exists because data is client-fetched

Refactor target:

- server-fetch history notes
- pass them to a client search/filter view
- keep only search interaction client-side

#### 6. Recall page

File:

- `src/app/(ui)/dictionary/recall/page.tsx`

Problems:

- `useEffect` fetch on mount
- `refresh` boolean rerender pattern

Refactor target:

- server-fetch recall notes
- render list from server data
- after grading, refresh via `router.refresh()` rather than boolean toggles

## Pages That Should Likely Stay Client

These should remain Client Components, but their logic can still be simplified:

- `src/app/(ui)/login/page.tsx`
- `src/app/(ui)/signup/page.tsx`
- `src/app/(si)/school/page.tsx`
- `src/app/(si)/school/signup/page.tsx`
- navbars with scroll listeners
- dropdown/menu-heavy note and drawer components
- interactive recall grading UI
- components depending on `window`, `document`, or `sessionStorage`

## Logic Simplification Targets

### 1. Remove fetch-on-mount pattern from pages

Replace patterns like:

- `useEffect(() => { fetch(); }, [])`
- local `isFetching`
- local `words/users/subscriptions` loader state

with server-loaded props.

### 2. Reduce rerender booleans

Replace patterns like:

- `refresh`
- `setRefresh(!refresh)`
- `rerenderFromChild`

with:

- `router.refresh()`
- server-driven rerender
- optimistic local update when appropriate

### 3. Eliminate effect-driven token checks

Verification/reset token pages should not need:

- `useEffect`
- `isFetching`
- client-side validity calculations

### 4. Keep effects only for real browser-side behavior

Valid `useEffect` cases still include:

- scroll listeners
- keyboard shortcuts
- outside-click listeners
- browser storage sync

But even there, effects should be small and focused.

### 5. Reduce local form state where it is unnecessary

Some forms may still be carrying more state than needed.

Target direction:

- prefer `useActionState` for form result handling
- keep local state only for true controlled-input behavior when necessary
- avoid resetting unrelated state manually after every action if action-driven UI can express the same result more directly

## Framer Motion and SSR Strategy

Framer Motion does not block SSR for the page as a whole.

Correct pattern:

- Server Component fetches and renders the page shell/data
- nested Client Component handles:
  - `motion`
  - `useState`
  - interactive UI transitions

So the question should not be:

- “Can this page use SSR if it has Framer Motion?”

The correct question is:

- “Which part of this page actually needs to remain client-side?”

## Recommended Refactor Order

### Phase 1

Refactor these first:

1. `src/app/(ui)/signup/[token]/page.tsx`
2. `src/app/(ui)/resetPassword/[token]/page.tsx`
3. `src/app/(si)/school/platform/students/page.tsx`
4. `src/app/(si)/school/platform/subscriptions/page.tsx`

Reason:

- highest cleanup value
- strongest SSR wins
- least controversial architecture changes

### Phase 2

Then refactor:

1. `src/app/(ui)/dictionary/history/page.tsx`
2. `src/app/(ui)/dictionary/recall/page.tsx`

Reason:

- removes common client-fetch pattern from dictionary pages
- prepares cleaner mutation refresh strategy

### Phase 3

Then revisit richer interactive sections:

1. `src/app/(ui)/dictionary/yourWords/page.tsx`
2. drawers-related client components
3. note interaction components

Reason:

- these likely need finer-grained splitting because of:
  - `sessionStorage`
  - window scroll logic
  - nested interaction state

### Phase 4

Final cleanup pass:

- reduce unnecessary `useEffect`
- normalize `router.refresh()` usage after mutations
- simplify forms and remove redundant local state
- review which pages can be converted from full client pages into server page + client view split

## Target End State

The target frontend architecture should look like this:

- server page loads data
- client child handles interaction
- token pages validate on server
- list pages filter/search on client only after server preload
- rerender booleans are minimized
- `useEffect` is reserved for true browser effects, not basic page data flow

## First Execution Pass Recommendation

If implementing incrementally, start with:

1. `src/app/(ui)/signup/[token]/page.tsx`
2. `src/app/(ui)/resetPassword/[token]/page.tsx`
3. `src/app/(si)/school/platform/students/page.tsx`
4. `src/app/(si)/school/platform/subscriptions/page.tsx`

This should give the clearest improvement in both:

- frontend simplicity
- SSR usage
- reduction of effect-driven client logic


# done
about
login
signup
loading
root page
root layout
dictionary/history
dictionary/inputWord
dictionary/yourWords

# todo
resetPassword
forgotpassword
dictionary/recall
components


# refactoring yourwords
- one ssr that fetches both notes and drawers
- then renders the toggle 
- and renders client component which conditionally redners notes or drawers

# react todo
- check for migrations from useActinoState to useTransition