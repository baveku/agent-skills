---
name: build
description: Implement the next task incrementally with tests and verification. Use when building a planned feature slice.
---

# Build

## Overview

Antigravity slash alias for implementation.

## When to Use

- The user invokes `/build`.
- A planned task should be implemented.
- The user invokes `/build auto` to run the whole approved plan.

## Process

1. Apply `rules/skill-routing.md`.
2. Follow `incremental-implementation`.
3. Follow `test-driven-development`.
4. For `/build auto`, use the autonomous mode rules from the command documentation and stop on ambiguity, failing tests without an obvious fix, or high-risk irreversible work.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "This alias has enough instructions." | The core workflows are `incremental-implementation` and `test-driven-development`; use them. |

## Red Flags

- The alias is followed without loading the core workflows.
- Routing rules are ignored.

## Verification

- `incremental-implementation` and `test-driven-development` verification are satisfied.
