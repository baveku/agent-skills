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

Apple-platform work should prefer Apple-specific skills such as `swiftui-ui-patterns`, `swiftui-view-refactor`, `swiftui-pro`, `swift-concurrency-pro`, `swiftdata-pro`, `swift-security-expert`, `ios-debugger-agent`, and `device-interaction`.

## Validation

Validate the plugin locally with:

```bash
agy plugin validate /path/to/agent-skills
```

## Notes

- Antigravity `plugin.json` supports only plugin identity metadata (`name`, `description`, and optional `$schema`).
- Do not add Antigravity TOML command files; use `skills/<alias>/SKILL.md` aliases instead.
- For persistent project-level routing, copy or link `AGENTS.md` into the workspace root.
