---
name: build
description: Implement the next task incrementally with tests and verification. Use when building a planned feature slice.
---

# Build

## Overview

Antigravity alias for implementation. Follow `incremental-implementation` and `test-driven-development`.

## When to Use

- The user invokes `/build`.
- A planned task should be implemented.
- The user invokes `/build auto` to run the whole approved plan.

## Process

1. Read the next pending task and its acceptance criteria.
2. Classify lifecycle, platform, and surface.
3. Add the most specific available web or Apple-platform skill:

| Task shape | Add this skill |
| --- | --- |
| Web UI or browser-facing UX | `frontend-ui-engineering` |
| SwiftUI screen, navigation, state, or layout | `swiftui-ui-patterns` |
| SwiftUI refactor or large view cleanup | `swiftui-view-refactor` |
| Swift concurrency / SwiftData / Apple security | `swift-concurrency-pro`, `swiftdata-pro`, or `swift-security-expert` as applicable |
| Runtime UI verification needed | web: `browser-testing-with-devtools`; iOS: `ios-debugger-agent` or `device-interaction` |

4. Write the failing test.
5. Implement the minimum code.
6. Run tests, build, and runtime verification when UI or native behavior changed.
7. Commit the slice and mark the task complete.

For `/build auto`, require an existing spec, create the plan if needed, get one explicit approval, then execute tasks in dependency order with one commit per task. Stop on ambiguity, failing tests without an obvious fix, or high-risk irreversible work.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "I'll test at the end." | Bugs compound across slices. |
| "This task can share a commit with cleanup." | Mixed commits are hard to review and revert. |

## Red Flags

- More than one task implemented at once.
- No failing test before behavior changes.
- Runtime UI/native behavior changed without runtime verification.

## Verification

- Relevant tests pass.
- Build passes.
- Runtime behavior is verified when applicable.
- One focused commit records the slice.

