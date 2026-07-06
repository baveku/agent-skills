---
name: planning
description: Break a validated spec into small implementation tasks. Use when the user asks to plan work or when a feature spec exists but tasks do not.
---

# Planning

## Overview

Antigravity alias for task planning. Follow `planning-and-task-breakdown`.

Use `/planning` instead of `/plan` because `/plan` may be reserved by the host.

## When to Use

- The user invokes `/planning`.
- A validated spec exists and implementation tasks are needed.
- Work needs dependency ordering and verification checkpoints.

## Process

1. Read `SPEC.md` or the equivalent spec.
2. Identify dependencies and vertical slices.
3. Write tasks with acceptance criteria and verification steps.
4. Save the plan to `tasks/plan.md` and the task list to `tasks/todo.md`.
5. Present the plan for review before build work starts.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "I can build directly from the spec." | Plans protect dependency order and task size. |
| "Tasks can be vague." | Vague tasks cause vague verification. |

## Red Flags

- Horizontal tasks like "build backend" and "build UI" instead of vertical slices.
- No acceptance criteria per task.
- No verification step per task.

## Verification

- `tasks/plan.md` exists.
- `tasks/todo.md` exists.
- Tasks are ordered by dependency and small enough to complete safely.

