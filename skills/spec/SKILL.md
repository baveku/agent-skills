---
name: spec
description: Start spec-driven development before writing code. Use when defining a new project, feature, or significant change.
---

# Spec

## Overview

Antigravity alias for the spec workflow. Follow `spec-driven-development` before writing code.

Classify the target platform as web, Apple platform, or shared backend/library. For Apple work, capture the app target, OS deployment range, SwiftUI/UIKit/AppKit split, persistence model, signing constraints, and simulator/device verification path.

## When to Use

- The user invokes `/spec`.
- A new project, feature, or significant change needs requirements.
- Requirements are unclear or need acceptance criteria before implementation.

## Process

1. Ask clarifying questions about objective, users, acceptance criteria, stack constraints, and boundaries.
2. Create `SPEC.md` with objective, commands, project structure, code style, testing strategy, boundaries, success criteria, and open questions.
3. For Apple-platform specs, include exact `xcodebuild` or SwiftPM commands, test target names, simulator destination, and App Store/TestFlight constraints.
4. Stop for user confirmation before planning or implementation.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "The request is obvious." | Specs surface hidden assumptions before they become rework. |
| "I'll fill in commands later." | Build/test commands are part of the contract. |

## Red Flags

- No acceptance criteria.
- No exact build/test command.
- Apple targets, signing, simulator destination, or OS range are guessed silently.

## Verification

- `SPEC.md` exists.
- Open questions and assumptions are explicit.
- Commands are executable, not placeholders.

