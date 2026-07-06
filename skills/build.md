---
name: build
description: Implement the next task incrementally with tests and verification. Use when building a planned feature slice.
---

# Build

Follow `incremental-implementation` and `test-driven-development`.

Before implementing, classify the task by platform and surface, then add the most specific available web or Apple-platform skill:

| Task shape | Add this skill |
| --- | --- |
| Web UI or browser-facing UX | `frontend-ui-engineering` |
| SwiftUI screen, navigation, state, or layout | `swiftui-ui-patterns` |
| SwiftUI refactor or large view cleanup | `swiftui-view-refactor` |
| Swift concurrency / SwiftData / Apple security | `swift-concurrency-pro`, `swiftdata-pro`, or `swift-security-expert` as applicable |
| Runtime UI verification needed | web: `browser-testing-with-devtools`; iOS: `ios-debugger-agent` or `device-interaction` |

Pick the next pending task, write the failing test, implement the minimum code, run tests, run the build, verify runtime behavior when UI/native behavior changed, commit the slice, and mark the task complete.

If the user invokes `/build auto`, require an existing spec, create the plan if needed, get one explicit approval, then execute every task in dependency order with one commit per task. Stop on ambiguity, failing tests without an obvious fix, or high-risk irreversible work.
