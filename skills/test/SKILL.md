---
name: test
description: Run the TDD workflow and prove behavior with failing tests first. Use when adding tests, fixing bugs, or verifying a change.
---

# Test

## Overview

Antigravity slash alias for testing.

## When to Use

- The user invokes `/test`.
- Behavior needs a failing test first.
- A bug fix needs a reproduction test.
- A change needs verification before review or ship.

## Process

1. Apply `rules/skill-routing.md`.
2. Follow `test-driven-development`.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "This alias has enough instructions." | The core workflow is `test-driven-development`; use it. |

## Red Flags

- The alias is followed without loading the core workflow.
- Routing rules are ignored.

## Verification

- `test-driven-development` verification is satisfied.
