# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — run with nodemon (watches `src/`)
- `npm start` — run once via node
- `docker compose up --build` — run inside Docker (port 4000, `.env` is loaded by compose)
- `npx eslint .` — lint (no `lint`/`format` npm scripts despite what the README says)
- `npx prettier --write .` — format
- No test runner is wired up; `npm test` exits with an error.

Deploy: `fly deploy` (config in `fly.toml`, app `candidates-api-luigibasantes`, region `iad`, internal port 4000).

## Required environment

Defined in `.env` (see `.env.example`):

- `MONGO_DB_URI` — Mongo connection string. `connectDB` (`src/config/db.js`) calls `process.exit(1)` if the connection fails, so the server won't start without it.
- `JWT_SECRET` — used by `controllers/auth.js` and the JWT passport strategy. The strategy falls back to the literal string `"SECRET"` if unset; **always set this in real environments**.
- `PORT` — defaults to 3000 in code, but `Dockerfile`/`fly.toml`/`docker-compose.yml` all expect 4000. Set `PORT=4000` when running in Docker/Fly.
- `AUTH_USERNAME` / `AUTH_PASSWORD` — credentials for the unused `general` Basic auth strategy registered in `middlewares/auth.js`.

## Architecture

Express 5 + Mongoose MVC. Entry point `src/index.js` loads dotenv and starts `src/app.js`, which wires the global middleware stack and mounts routes. There are two layers of auth:

1. **`/api/v1/auth`** (`routes/auth.js` → `controllers/auth.js`) — public. `register` bcrypts the password; `login` compares and signs a 15-minute JWT containing `{ id, email }`.
2. **`/api/v1/candidates`** (`routes/candidateV1.js` → `controllers/candidate.js`) — gated by `passport.authenticate("jwt", { session: false })` applied at the mount point in `app.js`, so every candidate route requires a `Bearer` token. The JWT strategy in `middlewares/auth.js` re-fetches the user from Mongo on each request and rejects deleted users.

Global middleware order in `app.js` matters: `cors` → `helmet` → `express.json` → `morgan` → `requestTimer` → `rateLimit` (100 req / 15 min, applies to *all* routes including `/auth`) → `passport.initialize`. The error handler (`middlewares/errorHandler.js`) is mounted last and returns a generic 500; controllers throw by letting async errors propagate (Express 5 forwards rejected promises automatically — no `express-async-handler` is used).

**Soft deletes**: both `candidate` and `users` models have a `deleted: Boolean` field. Every read/update query filters `{ deleted: false }`, and `deleteCandidate` does a `findOneAndUpdate({ deleted: true })` rather than a real delete. Preserve this pattern when adding new model operations — never use `findById*` without the deleted filter, and never hard-delete.

**Versioned routes**: the `candidateV1.js` filename and `/api/v1/...` prefix are deliberate; new breaking changes should land under a new version path rather than mutating V1.

Models live in `src/models/`. The `candidate` schema enforces `name`/`lastname` length 4–20, requires `linkedIn`, and constrains `status` to `["Pending", "In Review", "Interview", "Hiring"]`. The `users` schema requires password length ≥ 8 (raw, before bcrypt hashes — controllers must validate before hashing).

## Conventions

- CommonJS (`require`/`module.exports`), Node 24 (per Dockerfile).
- Tabs for indentation, double quotes, trailing commas (`.prettierrc.json` + `eslint.config.js` with `eslint-config-prettier`).
- Comments and user-facing messages are mixed Spanish/English — match the surrounding file.
- Unused function args must be prefixed with `_` to satisfy `no-unused-vars` (e.g. `_req`, `_next`).
