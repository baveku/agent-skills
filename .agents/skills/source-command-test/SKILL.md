---
name: "source-command-test"
description: "Run TDD workflow — write failing tests, implement, verify. For bugs, use the Prove-It pattern."
---

# source-command-test

Use this skill when the user asks to run the migrated source command `test`.

## Command Template

Invoke the agent-skills:test-driven-development skill.

Detect the project lane per `rules/skill-routing.md` before choosing extra verification skills:

| Lane | Surface | Add this skill when available |
| --- | --- | --- |
| 🌐 | Web runtime, DOM, console, network, visual behavior | `browser-testing-with-devtools` |
| 🍎 | iOS simulator/device behavior | `ios-debugger-agent` or `device-interaction` |
| 🍎 | Swift Testing test authoring/review | `swift-testing-pro` |
| 🍎 | Swift concurrency tests | `swift-concurrency-pro` |
| ⚙️ | API contract / integration tests, auth paths | `api-and-interface-design`, `security-and-hardening` |

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
