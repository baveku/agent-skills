---
name: planning
description: Break a validated spec into small implementation tasks. Use when the user asks to plan work or when a feature spec exists but tasks do not.
---

# Planning

## Overview

Antigravity slash alias for task planning.

Use `/planning` instead of `/plan` because `/plan` may be reserved by the host.

## When to Use

- The user invokes `/planning`.
- A validated spec exists and implementation tasks are needed.
- Work needs dependency ordering and verification checkpoints.

## Process

1. Apply `rules/skill-routing.md`.
2. Follow `planning-and-task-breakdown`.
3. Present the plan for review before build work starts.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "This alias has enough instructions." | The core workflow is `planning-and-task-breakdown`; use it. |

## Red Flags

- The alias is followed without loading the core workflow.
- Routing rules are ignored.

## Verification

- `planning-and-task-breakdown` verification is satisfied.
