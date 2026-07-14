# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Cursor, Copilot, Antigravity, etc.) when working with code in this repository.

> **Scope:** This file configures agents working on the [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) repository itself. It is not meant to be copied into other projects or into a global agent configuration; the reusable assets are the skills in `skills/`, not this file.

## Repository Overview

A collection of skills for Claude.ai and Claude Code for senior software engineers. Skills are packaged instructions and scripts that extend Claude and your coding agents capabilities.

## OpenCode Integration

OpenCode uses a **skill-driven execution model** powered by the `skill` tool and this repository's `/skills` directory.

### Core Rules

- If a task matches a skill, you MUST invoke it
- Skills are located in `skills/<skill-name>/SKILL.md`
- Never implement directly if a skill applies
- Always follow the skill instructions exactly (do not partially apply them)

### Intent → Skill Mapping

The agent should automatically map user intent to skills:

- Feature / new functionality → `spec-driven-development`, then `incremental-implementation`, `test-driven-development`
- Planning / breakdown → `planning-and-task-breakdown`
- Bug / failure / unexpected behavior → `debugging-and-error-recovery`
- Code review → `code-review-and-quality`
- Refactoring / simplification → `code-simplification`
- API or interface design → `api-and-interface-design`
- UI work → detect the project lane first, then use the most specific lane UI skill

### Project Lane → Skill Routing

`rules/skill-routing.md` is the canonical routing policy. This section summarizes it for harnesses that do not auto-load `rules/`.

Classify every engineering request in this order:

1. **Project lane** (detect first) — 🍎 Apple/Swift, 🌐 Frontend, ⚙️ Backend/API, 📱 React Native, 📺 React Native TV, 🅺 Kotlin, or 🤖 Android. Detect from repo files: `package.json` with react-native/expo → 📱 (check BEFORE 🌐 — RN repos also contain react; TV-targeted RN → 📺); `*.xcodeproj`/`Package.swift`/`*.swift` → 🍎; `package.json`+react/vue/svelte/vite or `*.tsx` → 🌐; `AndroidManifest.xml`/`com.android.application` plugin/Compose deps → 🤖 (check BEFORE 🅺 — Android repos are Kotlin repos too); `*.kt`/`build.gradle.kts`/KMP layout → 🅺 (check BEFORE ⚙️ — Kotlin repos also match gradle); `go.mod`/`Cargo.toml`/`pyproject.toml`/server `package.json`/`Dockerfile`+API → ⚙️. In a monorepo, detect per touched directory. A per-project `AGENTS.md` that pins a lane overrides detection.
2. **Lifecycle** — define, plan, build, verify, review, ship
3. **Surface** — UI, state, API, persistence, native bridge, build, testing, runtime verification, performance, security, accessibility, release

Stay in the detected lane: use its bucket plus the Shared (lifecycle) bucket only; cross lanes only for genuinely cross-cutting work and say so. Use the most specific available skill before a generic one:

| Lane | Surface | Prefer |
| --- | --- | --- |
| 🍎 | Any Apple/Swift surface | `swift-best-practices` — lane router; maps each surface to a reference under its `references/`, read on demand |
| 🌐 | Any web frontend surface | `web-best-practices` — lane router (UI, browser verification, performance); `/webperf` for full CWV audits |
| ⚙️ | Any backend/API surface | `backend-best-practices` — lane router (contracts, security, observability, CI/CD) |
| 📱 | Any React Native surface | `react-native-best-practices` (Callstack) — FPS, re-renders, TTI, bundle, memory, native modules |
| 📺 | React Native TV targets | `react-native-tv-best-practices` — focus/D-pad, 10-foot UI, TV playback |
| 🅺 | Kotlin / KMP | `kotlin-best-practices` (JetBrains) — Spring/JPA persistence, Java→Kotlin, KMP tooling migrations |
| 🤖 | Any native Android surface | `android-best-practices` (Google) — Compose UI, navigation, AGP, Perfetto, security, testing, Play, Wear, XR |

Every current platform routes through a lane router: React Native via `react-native-best-practices` / `react-native-tv-best-practices`, Kotlin/KMP via `kotlin-best-practices`, native Android via `android-best-practices`. For surfaces no router covers, use the generic lifecycle skill plus `source-driven-development` and the project's local commands instead of inventing skills.

### Skill Selection Limits

- Prefer one lifecycle skill + one lane skill + one verification skill per turn.
- Add more only when the user asks for a full workflow or the change is production-bound and cross-cutting.
- Generic (Shared-bucket) skills are defaults; lane-specific skills override them.

### Lifecycle Mapping (Implicit Commands)

OpenCode does not support slash commands like `/spec` or `/plan`.

Instead, the agent must internally follow this lifecycle:

- DEFINE → `spec-driven-development`
- PLAN → `planning-and-task-breakdown`
- BUILD → `incremental-implementation` + `test-driven-development`
- VERIFY → `debugging-and-error-recovery`
- REVIEW → `code-review-and-quality`
- SHIP → `shipping-and-launch`

### Execution Model

For every request:

1. Detect the project lane, then determine lifecycle and surface.
2. Choose the most specific applicable skill from the detected lane's routing table.
3. Invoke the appropriate skill using the `skill` tool. If the harness has no `skill` tool, read `skills/<skill-name>/SKILL.md` fully and follow it.
4. Follow the skill workflow strictly.
5. Only proceed to implementation after required steps (spec, plan, etc.) are complete.

### Anti-Rationalization

The following thoughts are incorrect and must be ignored:

- "This is too small for a skill"
- "I can just quickly implement this"
- "I’ll gather context first"

Correct behavior:

- Always check for and use skills first

This ensures OpenCode behaves similarly to Claude Code with full workflow enforcement.

## Orchestration: Personas, Skills, and Commands

This repo has three composable layers. They have different jobs and should not be confused:

- **Skills** (`skills/<name>/SKILL.md`) — workflows with steps and exit criteria. The *how*. Mandatory hops when an intent matches.
- **Personas** (`agents/<role>.md`) — roles with a perspective and an output format. The *who*.
- **Slash commands** (`.claude/commands/*.md` for Claude Code; `skills/<alias>/SKILL.md` aliases for Antigravity) — user-facing entry points. The *when*. The orchestration layer.

Composition rule: **the user (or a slash command) is the orchestrator. Personas do not invoke other personas.** A persona may invoke skills.

The only multi-persona orchestration pattern this repo endorses is **parallel fan-out with a merge step** — used by `/ship` to run `code-reviewer`, `security-auditor`, and `test-engineer` concurrently and synthesize their reports. Do not build a "router" persona that decides which other persona to call; that's the job of slash commands and intent mapping.

See [docs/agents.md](docs/agents.md) for the decision matrix and [references/orchestration-patterns.md](references/orchestration-patterns.md) for the full pattern catalog.

**Claude Code interop:** the personas in `agents/` work as Claude Code subagents (auto-discovered from this plugin's `agents/` directory) and as Agent Teams teammates (referenced by name when spawning). Two platform constraints align with our rules: subagents cannot spawn other subagents, and teams cannot nest. Plugin agents silently ignore the `hooks`, `mcpServers`, and `permissionMode` frontmatter fields.

## Creating a New Skill

> **Before you start:** run the pre-flight checks in [CONTRIBUTING.md](CONTRIBUTING.md#before-proposing-a-new-skill), search the catalog, check open PRs (`gh pr list --state open`), confirm the idea fits [docs/skill-anatomy.md](docs/skill-anatomy.md), and justify the gap in your PR description. Most new-skill ideas overlap an existing skill or an open PR; prefer extending an existing skill over adding a near-duplicate. CONTRIBUTING.md is the single source of truth for this workflow.

Skills in this repo are markdown-first: each lives at `skills/<kebab-case-name>/SKILL.md` with YAML frontmatter (`name`, `description`) and follows the section anatomy (Overview, When to Use, Process, Common Rationalizations, Red Flags, Verification). Add a `scripts/` directory only when the skill ships runnable helpers; most skills are markdown only, and there are no per-skill zip packages.

For the full format, naming conventions, frontmatter rules, supporting-file thresholds, and writing principles, see [docs/skill-anatomy.md](docs/skill-anatomy.md), the single source of truth for skill structure. Do not restate that guidance here, link to it.
