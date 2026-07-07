# Project AGENTS.md — ⚙️ Backend/API lane

Copy this into the root of a backend/service repo as `AGENTS.md` (or paste the
`## Skill lane` block into an existing `CLAUDE.md`). It pins the lane so the agent
skips project detection and never reaches for Apple or Frontend skills.

## Skill lane

This is a **Backend/API** project (<!-- set stack: Node/Go/Python/Rust/Java -->).

- Use the **⚙️ Backend/API bucket** + the **Shared bucket** from `rules/skill-routing.md`.
- Ignore Apple/Swift and Frontend skills, and all UI/simulator/browser tooling.
- Prefer platform skills over generic lifecycle skills: `api-and-interface-design` for
  contracts, `security-and-hardening` for any untrusted input or auth path.
- No dedicated persistence/messaging skill exists yet — for DB, queue, or cache work use
  `source-driven-development` against the official docs plus this repo's local commands.

## Fast picks

- API contracts / boundaries → `api-and-interface-design`
- Untrusted input / auth / secrets → `security-and-hardening`
- Logging / metrics / tracing → `observability-and-instrumentation`
- Pipelines → `ci-cd-and-automation`
