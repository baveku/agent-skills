# Using agent-skills with Antigravity CLI (agy)

The `agent-skills` repo installs directly as an Antigravity CLI plugin. Current Antigravity plugins are skill-first: plugin slash commands are generated from markdown skills, not from TOML command files.

Official reference: https://antigravity.google/docs/cli/plugins

## Setup

### Install from the remote repository

```bash
agy plugin install https://github.com/baveku/agent-skills.git
```

### Install from a local clone

```bash
git clone https://github.com/baveku/agent-skills.git
agy plugin install /path/to/agent-skills
```

Installed plugins are staged under:

```text
~/.gemini/antigravity-cli/plugins/<plugin_name>/
```

Verify installation:

```bash
agy plugin list
```

## Plugin Layout

Antigravity expects a plugin root with `plugin.json` plus optional component directories. For this repo, the plugin root is the repository root:

```text
agent-skills/
├── plugin.json
├── skills/
├── agents/
├── rules/
├── hooks.json
├── mcp_config.json
└── ...
```

This repo currently provides:

- `plugin.json` — Antigravity plugin identity.
- `rules/skill-routing.md` — always-on routing policy for lifecycle, platform, and surface selection.
- `skills/<name>/SKILL.md` — core workflow skills used by agents.
- `skills/<alias>/SKILL.md` — Antigravity-only slash aliases such as `/spec`, `/planning`, `/build`, `/test`, `/review`, `/code-simplify`, `/ship`, and `/webperf`.
- `agents/` — reusable subagent personas.

There is intentionally no `commands/*.toml` directory for Antigravity.

## Slash Commands

Antigravity converts markdown skills into slash commands automatically. The lifecycle aliases in `skills/<alias>/SKILL.md` map short command names to the underlying production workflows:

| Slash command | Alias skill | Core workflow |
| --- | --- | --- |
| `/spec` | `skills/spec/SKILL.md` | `spec-driven-development` |
| `/planning` | `skills/planning/SKILL.md` | `planning-and-task-breakdown` |
| `/build` | `skills/build/SKILL.md` | `incremental-implementation` + `test-driven-development` |
| `/test` | `skills/test/SKILL.md` | `test-driven-development` |
| `/review` | `skills/review/SKILL.md` | `code-review-and-quality` |
| `/code-simplify` | `skills/code-simplify/SKILL.md` | `code-simplification` |
| `/ship` | `skills/ship/SKILL.md` | `shipping-and-launch` |
| `/webperf` | `skills/webperf/SKILL.md` | `web-performance-auditor` persona |
| `/lane-init` | `skills/lane-init/SKILL.md` | pins the project's lane into `AGENTS.md` |

Use `/planning` instead of `/plan` because `/plan` may be reserved by the host.

## Commandless Use

Slash commands are optional. Natural-language requests should still route through `AGENTS.md` and `using-agent-skills`:

| Say this | Equivalent workflow |
| --- | --- |
| "Define this feature with a spec first" | `spec-driven-development` |
| "Plan this into small tasks" | `planning-and-task-breakdown` |
| "Build the next slice" | `incremental-implementation` + `test-driven-development` |
| "Test this bug with a failing repro first" | `test-driven-development` + `debugging-and-error-recovery` |
| "Review this change before merge" | `code-review-and-quality` |
| "Ship-check this production change" | `shipping-and-launch` |
| "Audit this web page's Core Web Vitals" | `web-performance-auditor` / `webperf` |

The agent should classify each task by lifecycle, platform, and surface, then load the most specific skill available.

## Skill Discovery

Antigravity automatically discovers skills inside the plugin's `skills/` directory. It uses skill frontmatter (`name`, `description`) to expose slash entries and route user intent.

Apple-platform work routes through the `swift-best-practices` lane router: Antigravity discovers only the router, and the router's table maps each surface (SwiftUI, concurrency, SwiftData, testing, accessibility, security, debugging, build/signing, App Store release) to a reference under `skills/swift-best-practices/references/<name>/SKILL.md`, read on demand.

## Staying under the token budget

Antigravity loads every skill under `skills/` (name + description + per-skill framing) plus `rules/` and MCP definitions into a shared budget of roughly **20k tokens**. Past that, entries are truncated and some skills silently stop being discoverable.

To keep headroom, this repo uses the **lane-router pattern**: one visible router skill per platform lane, with all domain skills nested under its `references/` directory and read on demand.

- Lane routers: `swift-best-practices/` (🍎, 34 references), `web-best-practices/` (🌐), `backend-best-practices/` (⚙️), `kotlin-best-practices/` (🅺, vendored from JetBrains), and `android-best-practices/` (🤖, 19 references vendored from Google's android/skills). Antigravity loads only each router's frontmatter; domain skills live under `skills/<router>/references/<name>/` and cost zero startup tokens. Each router's body maps task surfaces to the reference to read. `react-native-best-practices` and `react-native-tv-best-practices` (vendored from Callstack) follow the same shape with flat `references/*.md`.
- **Keep descriptions tight.** A skill's `description` is loaded every session; put exhaustive trigger lists and API enumerations in the skill body (loaded only on invocation), not the frontmatter.
- To consolidate another lane: create `skills/<lane>-best-practices/` with a routing-table SKILL.md, `git mv` the lane's skills under its `references/`, repoint the `claude/skills/<name>` and `codex/skills/<name>` symlinks to `../../skills/<lane>-best-practices/references/<name>`, update `skills-manifest.json` dest paths, and add the root to `NESTED_SKILL_ROOTS` in `scripts/validate-skills.js`.

## Validation

Validate the plugin locally with:

```bash
agy plugin validate /path/to/agent-skills
```

## Notes

- Antigravity `plugin.json` supports only plugin identity metadata (`name`, `description`, and optional `$schema`).
- Do not add Antigravity TOML command files; use `skills/<alias>/SKILL.md` aliases instead.
- For persistent project-level routing, run `/lane-init` in the target project — it detects the lane and writes the `## Skill lane` block into the project's `AGENTS.md` (templates in `docs/lane-templates/` remain available for manual copying).
