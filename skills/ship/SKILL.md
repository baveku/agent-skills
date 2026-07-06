---
name: ship
description: Run the pre-launch checklist and produce a go/no-go decision. Use when preparing a production-bound change for release.
---

# Ship

## Overview

Antigravity slash alias for release readiness.

## When to Use

- The user invokes `/ship`.
- A production-bound change needs a launch gate.
- The user asks for go/no-go, rollback, or release readiness.

## Process

1. Apply `rules/skill-routing.md`.
2. Follow `shipping-and-launch`.
3. Use `code-reviewer`, `security-auditor`, and `test-engineer` when the host supports subagents; otherwise run the same checks sequentially.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "This alias has enough instructions." | The core workflow is `shipping-and-launch`; use it. |

## Red Flags

- The alias is followed without loading the core workflow.
- Routing rules are ignored.

## Verification

- `shipping-and-launch` verification is satisfied.
