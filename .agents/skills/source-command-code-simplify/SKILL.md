---
name: "source-command-code-simplify"
description: "Simplify code for clarity and maintainability — reduce complexity without changing behavior"
---

# source-command-code-simplify

Use this skill when the user asks to run the migrated source command `code-simplify`.

## Command Template

Invoke the agent-skills:code-simplification skill.

Before simplifying, detect the project lane per `rules/skill-routing.md`. Simplification is largely lane-agnostic; add a 🍎 Apple/Swift skill when relevant. 🌐 Frontend and ⚙️ Backend simplification runs on the generic `code-simplification` skill plus that lane's review skill.

| Scope | Add this skill |
| --- | --- |
| SwiftUI view decomposition, state ownership, or layout cleanup | `swiftui-view-refactor` |
| SwiftUI code quality review after simplification | `swiftui-pro` |
| Swift concurrency or actor isolation cleanup | `swift-concurrency-pro` |
| SwiftData model/query cleanup | `swiftdata-pro` |

Simplify recently changed code (or the specified scope) while preserving exact behavior:

1. Read AGENTS.md and study project conventions
2. Identify the target code — recent changes unless a broader scope is specified
3. Understand the code's purpose, callers, edge cases, and test coverage before touching it
4. Scan for simplification opportunities:
   - Deep nesting → guard clauses or extracted helpers
   - Long functions → split by responsibility
   - Nested ternaries → if/else or switch
   - Generic names → descriptive names
   - Duplicated logic → shared functions
   - Dead code → remove after confirming
5. Apply each simplification incrementally — run tests after each change
6. Verify all tests pass, the build succeeds, and the diff is clean

If tests fail after a simplification, revert that change and reconsider. Use `code-review-and-quality` to review the result.
