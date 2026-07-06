---
name: code-simplify
description: Simplify code while preserving behavior. Use when code works but is harder to read, maintain, or safely change than it should be.
---

# Code Simplify

## Overview

Antigravity alias for simplification. Follow `code-simplification`.

## When to Use

- The user invokes `/code-simplify`.
- Code works but is too complex.
- Recent changes need cleanup without behavior changes.

## Process

1. Understand purpose, callers, edge cases, and test coverage before editing.
2. Classify the code surface and add the most specific Apple-platform skill when relevant:

| Scope | Add this skill |
| --- | --- |
| SwiftUI view decomposition, state ownership, or layout cleanup | `swiftui-view-refactor` |
| SwiftUI code quality review after simplification | `swiftui-pro` |
| Swift concurrency or actor isolation cleanup | `swift-concurrency-pro` |
| SwiftData model/query cleanup | `swiftdata-pro` |

3. Apply simplifications incrementally.
4. Run tests after each meaningful change.
5. Stop or revert the simplification if behavior changes.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "This nearby cleanup is harmless." | Unrelated cleanup expands risk. |
| "Simpler code does not need tests." | Behavior preservation needs evidence. |

## Red Flags

- Simplification changes behavior.
- Dead code removed without understanding.
- Tests fail after cleanup.

## Verification

- Tests pass.
- Build passes when relevant.
- Diff preserves behavior and reduces complexity.

