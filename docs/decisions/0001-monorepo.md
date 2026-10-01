# ADR 0001: One repository (monorepo) for Spry

Status: Accepted
Date: 2026-10-01

## Context
Spry consists of a backend, a frontend, database configuration (migrations),
and CI/deployment pipelines. We are a team of four building a product that
does not exist yet, and an AI agent will do a significant share of the
implementation work during this course.

## Decision
All of Spry lives in a single repository:

    spry/
    ├── backend/        API service
    ├── frontend/       web client
    ├── db/             schema, migrations, local DB config
    ├── .github/        CI/CD workflows
    ├── docker-compose.yml   one command to run everything locally
    └── docs/           decisions, structure, architecture

## Reasons
1. **Atomic changes.** One commit can change an endpoint and the client
   that calls it, so the API and its consumer cannot drift apart.
2. **The repository is the agent's context window.** With the whole
   pipeline in one tree, an agent can read the endpoint, the model, the
   migration and the component that renders it in a single pass. Split
   across three repositories, it sees a third of the system and guesses
   the rest. A guessed contract becomes a bug found at integration time.
3. **One setup, one source of truth.** A single clone, a single
   `docker compose up`, a single CI configuration.

## Trade-offs we accept
- **Coupled release cycle.** Backend and frontend deploy together by
  default. Mitigation: separate CI jobs with path filters.
- **No hard access boundaries.** Acceptable for a team of four.
- **Repo growth.** Not a concern at our size.

## Why not separate repositories
A boundary buys independence and costs context. Independence pays off
with multiple teams, different release cadences, or different access
requirements. We have none of these, so the cost outweighs the benefit.

## When we would revisit
- Separate teams with separate release cadences emerge.
- A component needs different access control or a public lifecycle
  (e.g. an open-source SDK).
- CI times become a bottleneck even with path filtering.
