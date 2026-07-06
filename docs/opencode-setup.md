# OpenCode Setup

This guide explains how to use Agent Skills with OpenCode in a way that closely mirrors the Claude Code experience (automatic skill selection, lifecycle-driven workflows, and strict process enforcement).

## Overview

OpenCode supports custom `/commands` in some setups, but this integration does not rely on slash commands. OpenCode also does not have a native plugin system or automatic skill routing like Claude Code.

Instead, we achieve parity through:

- A strong system prompt (`AGENTS.md`)
- The built-in `skill` tool
- Consistent skill discovery from the `/skills` directory

This creates an **agent-driven workflow** where skills are selected and executed automatically.

While it is possible to recreate `/spec`, `/plan`, and other commands in OpenCode, this integration intentionally uses an agent-driven approach instead:

- Skills are selected automatically based on intent
- Workflows are enforced via `AGENTS.md`
- No manual command invocation is required

This more closely matches how Claude Code behaves in practice, where skills are triggered automatically rather than manually.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/baveku/agent-skills.git
```

2. Open the project in OpenCode.

3. Ensure the following files are present in your workspace:

- `AGENTS.md` (root)
- `skills/` directory

No additional installation is required.

---

## How It Works

### 1. Skill Discovery

All skills live in:

```
skills/<skill-name>/SKILL.md
```

OpenCode agents are instructed (via `AGENTS.md`) to:

- Detect when a skill applies
- Invoke the `skill` tool
- Follow the skill exactly

### 2. Automatic Skill Invocation

The agent evaluates every request and maps it to the appropriate skill by classifying:

1. Lifecycle: define, plan, build, verify, review, ship.
2. Platform: web, iOS, Android, React Native, KMP, or shared backend/library.
3. Surface: UI, API, persistence, runtime verification, performance, security, accessibility, release.

Examples:

- "build a feature" → `incremental-implementation` + `test-driven-development`
- "design a system" → `spec-driven-development`
- "fix a bug" → `debugging-and-error-recovery`
- "review this code" → `code-review-and-quality`
- "build this SwiftUI screen" → `incremental-implementation` + `swiftui-ui-patterns`
- "verify this web UI bug in the browser" → `debugging-and-error-recovery` + `browser-testing-with-devtools`
- "audit this SwiftUI scrolling performance" → `swiftui-performance-audit`
- "change KMP shared models" → `api-and-interface-design` + `test-driven-development`, or a `kmp-*` skill if one exists

The user does **not** need to explicitly request skills.

### 3. Lifecycle Mapping (Implicit Commands)

The development lifecycle is encoded implicitly:

- DEFINE → `spec-driven-development`
- PLAN → `planning-and-task-breakdown`
- BUILD → `incremental-implementation` + `test-driven-development`
- VERIFY → `debugging-and-error-recovery`
- REVIEW → `code-review-and-quality`
- SHIP → `shipping-and-launch`

This replaces slash commands like `/spec`, `/plan`, etc.

Platform-specific skills override generic skills. For example, SwiftUI performance uses `swiftui-performance-audit` before `performance-optimization`, and browser runtime verification uses `browser-testing-with-devtools` before generic test guidance. If Android, React Native, or KMP-specific skills are not present, the agent should use `source-driven-development` plus the project's local build/test docs rather than inventing a missing skill.

---

## Usage Examples

### Example 1: Feature Development

User:
```
Add authentication to this app
```

Agent behavior:
- Detects feature work
- Invokes `spec-driven-development`
- Produces a spec before writing code
- Moves to planning and implementation skills

---

### Example 2: Bug Fix

User:
```
This endpoint is returning 500 errors
```

Agent behavior:
- Invokes `debugging-and-error-recovery`
- Reproduces → localizes → fixes → adds guards

---

### Example 3: Code Review

User:
```
Review this PR
```

Agent behavior:
- Invokes `code-review-and-quality`
- Applies structured review (correctness, design, readability, etc.)

---

## Agent Expectations (Critical)

For OpenCode to work correctly, the agent must follow these rules:

- Always check if a skill applies before acting
- If a skill applies, it MUST be used
- Never skip required workflows (spec, plan, test, etc.)
- Do not jump directly to implementation

These rules are enforced via `AGENTS.md`.

---

## Limitations

- No native slash commands (handled via intent mapping instead)
- No plugin system (handled via prompt + structure)
- Skill invocation depends on model compliance

Despite these, the workflow closely matches Claude Code in practice.

---

## Recommended Workflow

Just use natural language:

- "Design a feature"
- "Plan this change"
- "Implement this"
- "Fix this bug"
- "Review this"
- "Build this SwiftUI screen"
- "Verify this web flow in the browser"
- "Update this KMP shared API and tests"

The agent will automatically select and execute the correct skills.

---

## Summary

OpenCode integration works by combining:

- Structured skills (this repo)
- Strong agent rules (`AGENTS.md`)
- Automatic skill invocation via reasoning

This results in a **fully agent-driven, production-grade engineering workflow** without requiring plugins or manual commands.
