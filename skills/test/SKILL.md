---
name: test
description: Run the TDD workflow and prove behavior with failing tests first. Use when adding tests, fixing bugs, or verifying a change.
---

# Test

## Overview

Antigravity alias for testing. Follow `test-driven-development`.

## When to Use

- The user invokes `/test`.
- Behavior needs a failing test first.
- A bug fix needs a reproduction test.
- A change needs verification before review or ship.

## Process

1. For new behavior, write tests that fail first.
2. For bugs, reproduce with a failing test and confirm it fails.
3. Implement the minimum change.
4. Confirm the test passes and run regression tests.
5. Add platform verification when relevant:

| Platform / surface | Add this skill when available |
| --- | --- |
| Web runtime, DOM, console, network, visual behavior | `browser-testing-with-devtools` |
| iOS simulator/device behavior | `ios-debugger-agent` or `device-interaction` |
| Swift Testing test authoring/review | `swift-testing-pro` |
| Swift concurrency tests | `swift-concurrency-pro` |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "Manual checking is enough." | Tests prove behavior and prevent regressions. |
| "The bug is obvious." | A failing repro prevents false fixes. |

## Red Flags

- Test written after the fix without proving it fails.
- Only happy-path coverage.
- UI/runtime change verified only by reading code.

## Verification

- New or changed tests fail before the fix where applicable.
- Targeted tests pass.
- Regression suite or project-local equivalent passes.

