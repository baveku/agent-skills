---
name: test
description: Run the TDD workflow and prove behavior with failing tests first. Use when adding tests, fixing bugs, or verifying a change.
---

# Test

Follow `test-driven-development`.

For new behavior, write tests that fail first, implement the code, then refactor while tests stay green. For bugs, use the Prove-It pattern: reproduce with a failing test, confirm it fails, fix, confirm it passes, and run regression tests.

Add platform verification when relevant:

| Platform / surface | Add this skill when available |
| --- | --- |
| Web runtime, DOM, console, network, visual behavior | `browser-testing-with-devtools` |
| iOS simulator/device behavior | `ios-debugger-agent` or `device-interaction` |
| Swift Testing test authoring/review | `swift-testing-pro` |
| Swift concurrency tests | `swift-concurrency-pro` |
