# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Cursor, Copilot, Antigravity, etc.) when working with code in this repository.

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
- UI work → classify platform first, then use the most specific platform UI skill

### Platform → Skill Routing

Classify every engineering request in this order:

1. **Lifecycle** — define, plan, build, verify, review, ship
2. **Platform** — web, iOS, Android, React Native, Kotlin Multiplatform (KMP), or shared backend/library
3. **Surface** — UI, state, API, persistence, native bridge, build, testing, runtime verification, performance, security, accessibility, release

Use the most specific available skill before a generic skill:

| Platform / surface | Prefer | Fallback |
| --- | --- | --- |
| Web UI | `frontend-ui-engineering` | `api-and-interface-design` for contracts |
| Web runtime verification | `browser-testing-with-devtools` | project test scripts |
| Web performance / Core Web Vitals | `/webperf`, `performance-optimization` | `browser-testing-with-devtools` when runtime data is needed |
| iOS SwiftUI UI | `swiftui-ui-patterns`, `swiftui-pro`, `swiftui-view-refactor` | `frontend-ui-engineering` only for generic UI principles |
| iOS SwiftUI performance | `swiftui-performance-audit` | `performance-optimization` |
| iOS accessibility | `swiftui-accessibility-auditor`, `ios-accessibility` | `frontend-ui-engineering` accessibility rules |
| iOS runtime verification | `ios-debugger-agent`, `device-interaction` | Xcode build/test commands from the project |
| Swift concurrency / data / security | `swift-concurrency-pro`, `swiftdata-pro`, `swift-security-expert` | `security-and-hardening` for general security |
| Android UI/runtime | `android-*` skills when present | `source-driven-development` + project-local Android docs |
| React Native UI/runtime | `react-native-*` skills when present | `frontend-ui-engineering` + platform runtime verification |
| KMP shared logic | `kmp-*` skills when present | `api-and-interface-design` + `test-driven-development` |

Do not invent missing skills. If a platform-specific skill is not present, use the generic lifecycle skill plus `source-driven-development` and the project's local commands.

### Skill Selection Limits

- Prefer one lifecycle skill + one platform/domain skill + one verification skill per turn.
- Add more only when the user asks for a full workflow or the change is production-bound and cross-cutting.
- Generic skills are defaults; platform-specific skills override them.

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

1. Determine lifecycle, platform, and surface.
2. Choose the most specific applicable skill from the platform routing table.
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
- **Slash commands** (`.claude/commands/*.md`) — user-facing entry points. The *when*. The orchestration layer.

Composition rule: **the user (or a slash command) is the orchestrator. Personas do not invoke other personas.** A persona may invoke skills.

The only multi-persona orchestration pattern this repo endorses is **parallel fan-out with a merge step** — used by `/ship` to run `code-reviewer`, `security-auditor`, and `test-engineer` concurrently and synthesize their reports. Do not build a "router" persona that decides which other persona to call; that's the job of slash commands and intent mapping.

See [docs/agents.md](docs/agents.md) for the decision matrix and [references/orchestration-patterns.md](references/orchestration-patterns.md) for the full pattern catalog.

**Claude Code interop:** the personas in `agents/` work as Claude Code subagents (auto-discovered from this plugin's `agents/` directory) and as Agent Teams teammates (referenced by name when spawning). Two platform constraints align with our rules: subagents cannot spawn other subagents, and teams cannot nest. Plugin agents silently ignore the `hooks`, `mcpServers`, and `permissionMode` frontmatter fields.

## Creating a New Skill

> **Before you start:** run the pre-flight checks in [CONTRIBUTING.md](CONTRIBUTING.md#before-proposing-a-new-skill), search the catalog, check open PRs (`gh pr list --state open`), confirm the idea fits [docs/skill-anatomy.md](docs/skill-anatomy.md), and justify the gap in your PR description. Most new-skill ideas overlap an existing skill or an open PR; prefer extending an existing skill over adding a near-duplicate. CONTRIBUTING.md is the single source of truth for this workflow.

Skills in this repo are markdown-first: each lives at `skills/<kebab-case-name>/SKILL.md` with YAML frontmatter (`name`, `description`) and follows the section anatomy (Overview, When to Use, Process, Common Rationalizations, Red Flags, Verification). Add a `scripts/` directory only when the skill ships runnable helpers; most skills are markdown only, and there are no per-skill zip packages.

For the full format, naming conventions, frontmatter rules, supporting-file thresholds, and writing principles, see [docs/skill-anatomy.md](docs/skill-anatomy.md), the single source of truth for skill structure. Do not restate that guidance here, link to it.
