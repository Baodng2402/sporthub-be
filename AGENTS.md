# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Project Reality

- This is a single-package NestJS backend (`sporthub-be`), not a monorepo.
- Runtime entrypoint is `src/main.ts`.
- Default port is `3001` unless `PORT` is set.
- `README.md` is the Nest starter template. Trust `package.json`, config files, and source code over README prose.

## Decision Priority

When implementing changes, follow this priority:

1. Existing repository patterns.
2. This `AGENTS.md`.
3. Official framework/library documentation via MCP/docs when needed.
4. Minimal, working implementation over idealized rewrites.

Do not introduce new architecture, abstractions, libraries, or folder structures unless the task clearly requires it.

## Source of Truth Commands

- Install dependencies: `npm install`
- Dev server: `npm run start:dev`
- Build: `npm run build`
- Prod run from build output: `npm run start:prod`
- Lint: `npm run lint`
  - Important: this uses `--fix`, so it may mutate files.
- Format: `npm run format`
- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`
- Coverage: `npm run test:cov`

## Focused Verification

Prefer targeted verification before broad verification.

Useful targeted commands:

- Single unit spec: `npm test -- src/app.controller.spec.ts`
- Single e2e spec: `npm run test:e2e -- test/app.e2e-spec.ts`

Before finishing a code change:

- Run the smallest relevant test or build check when possible.
- Avoid unrelated formatting changes.
- Mention any verification that could not be run.
- Mention assumptions only when they affect behavior, data shape, or user-facing flow.

## Prisma / Database Workflow

- Prisma schema is located at `prisma/schema.prisma`.
- Prisma client is generated to `generated/prisma`.
- The app imports Prisma from the custom generated output, for example through `lib/prisma.ts`.
- Do not assume the default Prisma client path.
- `DATABASE_URL` is required. App/Prisma should fail immediately if it is missing.
- Prisma config is in `prisma.config.ts`.
- Prisma config loads env through `dotenv/config`.
- Seed command is configured as `tsx prisma/seed.ts`.

Useful Prisma commands:

- Generate client: `npx prisma generate`
- Apply local migration: `npx prisma migrate dev`
- Seed DB: `npx prisma db seed`
- Verify DB connectivity: `npx tsx scripts/verify-prisma.ts`

When changing database models:

- Update `prisma/schema.prisma`.
- Generate Prisma client after schema changes.
- Add or update migrations only when required.
- Do not hand-edit generated Prisma output.

## Codebase Structure Notes

- Main app wiring is currently minimal starter state.
- Only `AppController` and `AppService` are currently registered in `src/app.module.ts`.
- `src/modules/*` folders currently contain `.gitkeep` placeholders.
- Placeholder module folders are not wired into `AppModule` yet.
- `dist/` and `generated/` are ignored build/generated artifacts.
- Do not hand-edit `dist/` or `generated/`.

## Architecture Rules

- Keep controllers thin.
- Put business logic inside services.
- Keep Prisma/database access inside service or repository-style layers.
- Do not place business logic directly in controllers.
- Avoid cross-module imports unless necessary.
- Prefer clear NestJS module boundaries once modules are introduced.
- Do not create generic abstractions for single-use logic.
- Follow existing naming and folder conventions before creating new ones.

## API / DTO / Validation Conventions

- Prefer explicit DTOs for request payloads.
- Validate incoming payloads with NestJS validation patterns when applicable.
- Do not return raw database models if a response DTO or mapped response is more appropriate.
- Use clear REST naming conventions.
- Prefer explicit HTTP status handling when behavior is non-default.
- Keep API behavior predictable and easy to test.

## Simplicity Rules

- Prefer small, surgical changes.
- Touch only files required by the task.
- Every changed line should trace back to the requested change.
- Do not refactor unrelated code.
- Do not reformat unrelated files.
- Avoid speculative features.
- Avoid premature optimization.
- If a solution feels large, first look for a smaller one.

## TypeScript / Linting Quirks

- TypeScript config uses `module: nodenext`.
- TypeScript config uses `moduleResolution: nodenext`.
- ESLint is flat config via `eslint.config.mjs`.
- ESLint uses type-aware rules with `projectService: true`.
- Prettier integration is enabled.
- `@typescript-eslint/no-explicit-any` is intentionally off.
- Avoid re-enabling `no-explicit-any` unless explicitly requested.

## Documentation / MCP Usage

- `context7` MCP is available for up-to-date framework/library documentation.
- Use external docs when repository behavior is unclear or when working with framework/library APIs.
- Prefer existing project patterns over generic documentation examples.
- Do not introduce new library patterns without checking current project usage first.
- For NestJS, Prisma, TypeScript, ESLint, or testing behavior, use docs as support, not as a reason to rewrite existing working patterns.

## Agent Behavior

- Understand nearby code before editing.
- Follow existing patterns unless there is a clear reason not to.
- If ambiguity is low-risk, choose the simplest reasonable path and state the assumption briefly.
- If ambiguity changes behavior, data shape, database schema, API contract, or user-facing flow, ask before editing.
- Push back when the requested approach would overcomplicate the codebase.
- Prefer correctness, small diffs, and clear verification over speed.

## Do Not

- Do not treat this repository as a monorepo.
- Do not trust README starter prose over actual config/source files.
- Do not hand-edit `dist/`.
- Do not hand-edit `generated/`.
- Do not wire placeholder modules into `AppModule` unless the task requires it.
- Do not add new packages without a clear need.
- Do not create broad architecture rewrites for small feature requests.