# Project AGENTS.md — 🌐 Frontend lane

Copy this into the root of a web frontend repo as `AGENTS.md` (or paste the
`## Skill lane` block into an existing `CLAUDE.md`). It pins the lane so the agent
skips project detection and never reaches for Apple or Backend skills.

## Skill lane

This is a **Frontend/web** project (React/Vue/Svelte/Next, Vite, TypeScript).

- Use the **🌐 Frontend bucket** + the **Shared bucket** from `rules/skill-routing.md`.
- Ignore Apple/Swift and Backend/API skills.
- Prefer platform skills over generic lifecycle skills: `webperf` before `performance-optimization`.
- Runtime verification goes through `browser-testing-with-devtools`, not simulator/device tools.

## Fast picks

Open the `web-best-practices` router first — its table maps every surface to the reference to read.

- UI / components / state → `web-best-practices/references/frontend-ui-engineering`
- Verify in a real browser → `web-best-practices/references/browser-testing-with-devtools`
- Core Web Vitals → `/webperf` command
