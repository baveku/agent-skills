---
name: lane-init
description: Detects the project's routing lane and pins it into AGENTS.md by creating or updating the "## Skill lane" block. Use when the user invokes /lane-init, asks to set up or initialize lane routing for a project, or wants AGENTS.md configured so agents stop re-detecting the platform each session.
---

# Lane Init

## Overview

Antigravity slash alias for pinning a project's routing lane into its `AGENTS.md`. Detection runs once, the result is written down, and every later session trusts the pin instead of re-detecting.

## When to Use

- The user invokes `/lane-init`.
- A project's `AGENTS.md` should be created or updated with a `## Skill lane` block.
- The project's stack changed (e.g. added React Native) and the pinned lane is stale.

## Process

1. Apply the Project Detection table in `rules/skill-routing.md` (respect the check order — 📱 before 🌐, 🤖 before 🅺 before ⚙️).
2. Follow the full procedure in `.claude/commands/lane-init.md`: detect with evidence, build the block from the matching `docs/lane-templates/AGENTS.<lane>.md` template, write idempotently (replace an existing `## Skill lane` section, never duplicate).
3. Show the detected lane, evidence, and exact block; get an explicit yes before writing the user's project file.
4. For monorepos, ask: per-directory `AGENTS.md` (preferred) or a single root block listing lanes per directory.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "Detection is obvious, just write the file." | It edits the user's project file — show the block and confirm first. |
| "Append a fresh block, the old one is harmless." | Two `## Skill lane` blocks give agents contradictory pins. Replace, never duplicate. |
| "The signals are mixed, pick the strongest." | Mixed signals mean monorepo or ambiguity — ask, do not guess. |

## Red Flags

- Writing `AGENTS.md` without showing the block and getting confirmation.
- A second `## Skill lane` section appearing in the file.
- Pinning a lane despite conflicting detection evidence without asking.

## Verification

- `AGENTS.md` (or `CLAUDE.md`, if the user chose it) contains exactly one `## Skill lane` block naming the detected lane and its router.
- The block's stack details match the actual project, not template placeholders.
- Re-running the command replaces the block in place.
