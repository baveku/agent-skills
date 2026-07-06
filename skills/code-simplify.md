---
name: code-simplify
description: Simplify code while preserving behavior. Use when code works but is harder to read, maintain, or safely change than it should be.
---

# Code Simplify

Follow `code-simplification`.

Before simplifying, classify the code surface and add the most specific Apple-platform skill when relevant:

| Scope | Add this skill |
| --- | --- |
| SwiftUI view decomposition, state ownership, or layout cleanup | `swiftui-view-refactor` |
| SwiftUI code quality review after simplification | `swiftui-pro` |
| Swift concurrency or actor isolation cleanup | `swift-concurrency-pro` |
| SwiftData model/query cleanup | `swiftdata-pro` |

Understand purpose, callers, edge cases, and test coverage before editing. Apply simplifications incrementally and run tests after each meaningful change.
