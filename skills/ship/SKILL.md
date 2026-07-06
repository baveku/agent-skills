---
name: ship
description: Run the pre-launch checklist and produce a go/no-go decision. Use when preparing a production-bound change for release.
---

# Ship

## Overview

Antigravity alias for release readiness. Follow `shipping-and-launch`.

## When to Use

- The user invokes `/ship`.
- A production-bound change needs a launch gate.
- The user asks for go/no-go, rollback, or release readiness.

## Process

1. Classify the release platform as web, Apple platform, or shared backend/library.
2. Run or simulate flat fan-out review with `code-reviewer`, `security-auditor`, and `test-engineer`.
3. Merge reports into one go/no-go decision.
4. Check quality, security, performance, accessibility, infrastructure, documentation, runtime verification, and rollback plan.
5. Use `browser-testing-with-devtools` for web runtime evidence.
6. Use `ios-debugger-agent`, `device-interaction`, Xcode build/test commands, or App Store Connect skills for Apple release flow when relevant.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "The diff is small, so it can ship." | Blast radius matters more than line count. |
| "Rollback is obvious." | Rollback must be explicit before launch. |

## Red Flags

- No rollback plan.
- Critical finding ignored without explicit risk acceptance.
- Runtime verification missing for user-facing behavior.

## Verification

- Go/no-go decision is explicit.
- Blockers and acknowledged risks are listed.
- Rollback trigger and procedure are documented.

