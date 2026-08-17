# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SignTag is a sign-language-focused data labeling platform (part of the SignLex/SAIL project). Researchers upload datasets of images/video, define "studies" with labeling fields (text, numeric, recorded video, or lexicon-referenced sign tokens), and invite participants to label the data. Labeled data can be exported as a zip (media) + CSV (labels).

This is an npm-workspaces-free monorepo: each package under `packages/` has its own `package.json`, `package-lock.json`, and `node_modules` — there is no root install step or root build tool. `cd` into a package before running any script.

## Packages

- **`packages/server`** — NestJS GraphQL API (Apollo Federation subgraph, name `signlab`). Owns MongoDB (via Mongoose), GCP Storage buckets, Casbin-based permissions, JWT auth. This is the primary backend. Being refactored to have REST controllers which adhear to the React Admin simple data provider.
- **`packages/gateway`** — NestJS Apollo Gateway. Federates two subgraphs into one schema: `signlab` (this repo's `server`) and `lex_service` (an external SignLex sign-lexicon service, not in this repo). Forwards `authorization` and `organization` headers to subgraphs. Has no business logic of its own.
- **`packages/client`** — React 19 + Vite frontend researchers/participants use (labeling UI, dataset/study management). Talks to the gateway's GraphQL endpoint via Apollo Client. Firebase Auth for login; i18next for translations.
- **`packages/admin`** — React 19 + Vite in development UI built with React Admin. Will eventually replace the admin functionality in packages/client.
- **`packages/zipper`** — oclif CLI, packaged as a Docker image and run as a GCP Cloud Run Job. Given a set of storage entries, zips them for export downloads. Invoked by the server (`downloads`/`ZIP_JOB_NAME` config), not run interactively during normal dev.
- **`packages/scripts/downloading`** — standalone Python script (`entry-download.py`) for bulk-downloading entries; not part of the JS build graph.
- **`deploy/dev`** — `docker-compose.yml` providing a local MongoDB only. No local auth, GCP bucket, or GCP job emulation — those require real GCP/Firebase credentials even in dev.

## Architecture: request flow

```
client / admin  →  gateway (Apollo Gateway, port app-configured)  →  server (signlab subgraph)
                                                                  →  lex_service (external, not in repo)
```

- Auth: Firebase Auth issues ID tokens client-side. The client sends `Authorization: Bearer <token>` and an `organization` header (tenant ID) on every GraphQL request. The gateway copies both headers through to subgraphs unchanged (`gateway/src/app.module.ts`). The server validates the JWT against Google's public keys (`server/src/jwt`) and resolves the `organization` header to a tenant via `OrganizationGuard` (`server/src/organization/organization.guard.ts`), attaching it to `req.organization`.
- Multi-tenancy: organizations map 1:1 to Firebase tenants. Most domain resolvers assume `req.organization` is present.
- Authorization: permissions are enforced with Casbin (`server/src/permission`), model defined in `server/src/config/casbin-model.conf` (RBAC with two grouping relations, `g` and `g2`). Roles are hierarchical: Owner > Project Admin > Study Admin > Contributor/Trained Contributor, scoped to organization/project/study IDs as the Casbin object. `g2` is specifically used to grant a *project* access to a *dataset* (`grantProjectDatasetAccess`), not a user role.
- Feature flags: a global `APP_GUARD` (`FeatureFlagGuard`) checks resolvers/handlers annotated with `@FeatureFlag(envVarName)` against a matching env var; missing or falsy env var blocks the endpoint with `NotImplementedException`.
- Storage: media (images/video) lives in GCP Buckets, abstracted behind `server/src/bucket` (`Bucket` interface, `GcpBucket` implementation, `BucketFactoryService`). Signed URLs are used for upload/playback with configurable expirations (`server/src/config/configuration.ts`).
- Exports/downloads: the server triggers the `zipper` Cloud Run Job (via `@google-cloud/run`) to zip requested entries into a downloadable archive; see `server/src/download-request`.
- Domain modules in `server/src` roughly mirror the data model: `organization`, `project`, `study`, `dataset`, `entry`, `tag` (lexicon/label field definitions), `user`, `permission`. Each follows the same NestJS module shape: `*.model.ts` (Mongoose schema + GraphQL type), `*.service.ts`, `*.resolver.ts`, plus `dtos/` and `pipes/` for input validation.

## Local development

There is no single root command — work inside the relevant package.

Local Mongo (required by `server`):
```sh
cd deploy/dev && docker compose up
```

Server (GraphQL subgraph, NestJS):
```sh
cd packages/server
npm install
npm run start:dev        # watch mode, http://localhost:<port>/graphql
npm run test             # jest unit tests (*.spec.ts, colocated with source)
npm run test -- path/to/file.spec.ts   # single test file
npm run test:e2e         # e2e tests under test/
npm run lint             # eslint --fix
npm run prettier:fix
```
Server needs a `.env`; see `src/config/configuration.ts` for every env var and its default (`MONGO_URI`, `CASBIN_MONGO_URI`, `GCP_KEY_FILENAME`, `GATEWAY_ENDPOINT`, `ZIP_JOB_NAME`, etc.). Feature-flagged endpoints require the corresponding env var set to `"true"` (e.g. `SIGNTAG_ADMIN_PROJECT_ENDPOINT`).

Gateway (Apollo Gateway, must be pointed at a running server + lex_service):
```sh
cd packages/gateway
npm install
npm run start:dev
```
Needs `.env` from `.env.sample` (`SIGNLAB_URI`, `AUTH_URI`, `LEX_URI`). Gateway schema composition uses `IntrospectAndCompose`, so `server` must already be running and reachable at `signlab.uri` before the gateway starts.

Client (researcher/participant web app):
```sh
cd packages/client
npm install
npm run dev               # vite dev server
npm run build              # tsc && vite build
npm run introspection       # regenerate graphql-codegen types from graphql-codegen.yml against a running gateway
npm run i18next              # extract/update translation keys (i18next-parser)
npm run prettier:fix
```
Needs Vite env vars for the gateway endpoint, Firebase config, and health endpoint (see CI workflow `.github/workflows/client.yaml` for the full list: `VITE_GRAPHQL_ENDPOINT`, `VITE_ASL_LEXICON_ID`, `VITE_AUTH_API_KEY`, `VITE_AUTH_DOMAIN`, `VITE_HEALTH_ENDPOINT`).

Admin (React Admin CRUD app):
```sh
cd packages/admin
npm install
npm run dev
npm run build
npm run lint
```
Needs `VITE_BACKEND_API_BASE_URL` pointing at the server's REST admin API (e.g. `http://localhost:3000/api/v1/admin`).

Zipper (CLI, rarely run outside its Cloud Run Job container):
```sh
cd packages/zipper
npm install
npm run build
```

## CI/CD notes

Each package has its own GitHub Actions workflow (`.github/workflows/{admin,client,gateway,server}.yaml`), triggered only on changes under that package's path. Pattern: `lint` (prettier check) + `build` run on every push/PR; on `main` pushes or `v*.*.*` tags, workflows additionally deploy to GCP (staging on `main`, EU+US prod on version tags) via Workload Identity Federation — `client` uploads its static build to a GCS bucket, `server`/`gateway` deploy to App Engine. There is no top-level CI aggregation; each package is independently gated.
