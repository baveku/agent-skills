---
name: review
description: Run a five-axis code review before merge. Use when reviewing staged changes, recent commits, or a pull request.
---

# Review

## Overview

Antigravity slash alias for review.

## When to Use

- The user invokes `/review`.
- Staged changes, recent commits, or a pull request need review.
- A change is ready for quality gate checks.

## Process

1. Apply `rules/skill-routing.md`.
2. Follow `code-review-and-quality`.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "This alias has enough instructions." | The core workflow is `code-review-and-quality`; use it. |

## Red Flags

- The alias is followed without loading the core workflow.
- Routing rules are ignored.

## Verification

- `code-review-and-quality` verification is satisfied.
