# Using agent-skills with Codex

This repo is a Codex plugin. The Codex manifest lives at `.codex-plugin/plugin.json`, and the repo marketplace entry lives at `.agents/plugins/marketplace.json`.

Official reference: https://developers.openai.com/codex/plugins/build?install-scope=workspace

## Install from GitHub

```bash
codex plugin marketplace add baveku/agent-skills
codex plugin add agent-skills@baveku-agent-skills
```

> Requires Codex CLI v0.122 or later. On older releases, use `codex marketplace add` for the first command. See the [Codex CLI docs](https://developers.openai.com/codex/cli).

## Install from a local clone

```bash
git clone https://github.com/baveku/agent-skills.git
codex plugin marketplace add ./agent-skills
codex plugin add agent-skills@baveku-agent-skills
```

After installation, start a new Codex thread and ask Codex to use Agent Skills, or invoke the plugin/skill explicitly with `@`.

## What Codex Loads

Codex reads `.codex-plugin/plugin.json`, then loads skills from:

```text
codex/skills/
```

That directory is an alias-free view of the shared skill catalog. It intentionally excludes Antigravity-only slash aliases such as `skills/spec`, `skills/build`, and `skills/ship`. The manifest declares an empty Codex hook configuration so Codex does not auto-load Claude-oriented hooks.

## Commands

Codex does not use this repo's Claude command files. Use natural language:

| Instead of | Say |
|------------|-----|
| `/spec` | "Use Agent Skills to define this feature with a spec first." |
| `/plan` | "Break this spec into small verifiable tasks." |
| `/build` | "Build the next slice using the repo workflow." |
| `/test` | "Write the failing test first, then make it pass." |
| `/review` | "Review this change across correctness, architecture, security, and performance." |
| `/ship` | "Ship-check this production change with rollback planning." |
| `/webperf` | "Audit this web page's Core Web Vitals." |

## Agents

The `agents/` personas are reusable Markdown personas for tools that support them, but Codex plugin manifests do not bundle subagents through an `agents` field. Codex custom agents are standalone TOML files under `~/.codex/agents/` or `.codex/agents/`.

## Validate

```bash
node scripts/validate-skills.js
node scripts/validate-commands.js
node scripts/validate-plugin-manifests.js
```
