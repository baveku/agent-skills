---
description: Run TDD workflow — write failing tests, implement, verify. For bugs, use the Prove-It pattern.
---

Invoke the agent-skills:test-driven-development skill.

Classify the platform before choosing extra verification skills:

| Platform / surface | Add this skill when available |
| --- | --- |
| Web runtime, DOM, console, network, visual behavior | `browser-testing-with-devtools` |
| iOS simulator/device behavior | `ios-debugger-agent` or `device-interaction` |
| Swift Testing test authoring/review | `swift-testing-pro` |
| Swift concurrency tests | `swift-concurrency-pro` |
| Android, React Native, or KMP | platform-specific skill if present; otherwise use project-local test commands plus `source-driven-development` |

For new features:
1. Write tests that describe the expected behavior (they should FAIL)
2. Implement the code to make them pass
3. Refactor while keeping tests green

For bug fixes (Prove-It pattern):
1. Write a test that reproduces the bug (must FAIL)
2. Confirm the test fails
3. Implement the fix
4. Confirm the test passes
5. Run the full test suite for regressions

For rendered UI or native behavior, also run platform runtime verification. Web uses Chrome DevTools MCP via `browser-testing-with-devtools`; iOS uses Xcode/simulator verification via `ios-debugger-agent` or `device-interaction` when available.
