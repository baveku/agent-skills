---
name: "source-command-review"
description: "Conduct a five-axis code review — correctness, readability, architecture, security, performance"
---

# source-command-review

Use this skill when the user asks to run the migrated source command `review`.

## Command Template

Invoke the agent-skills:code-review-and-quality skill.

Before reviewing, detect the project lane per `rules/skill-routing.md` and add the most specific review skill from that lane:

| Lane | Scope | Add this skill |
| --- | --- | --- |
| 🍎 | SwiftUI code | `swiftui-pro` |
| 🍎 | SwiftUI performance symptoms or large dynamic lists | `swiftui-performance-audit` |
| 🍎 | SwiftUI accessibility | `swiftui-accessibility-auditor` |
| 🍎 | Swift concurrency | `swift-concurrency-pro` |
| 🍎 | SwiftData | `swiftdata-pro` |
| 🍎 | Apple security, Keychain, CryptoKit, ATS, entitlements | `swift-security-expert` |
| 🌐 | Web performance / Core Web Vitals | `/webperf` or `performance-optimization` |
| ⚙️ | API contract / boundary correctness | `api-and-interface-design` |
| ⚙️/🌐 | Untrusted input, auth, secrets | `security-and-hardening` |
| ⚙️ | Logging / metrics / tracing gaps | `observability-and-instrumentation` |

Review the current changes (staged or recent commits) across all five axes:

1. **Correctness** — Does it match the spec? Edge cases handled? Tests adequate?
2. **Readability** — Clear names? Straightforward logic? Well-organized?
3. **Architecture** — Follows existing patterns? Clean boundaries? Right abstraction level?
4. **Security** — Input validated? Secrets safe? Auth checked? Use the platform-specific security skill when present, otherwise `security-and-hardening`.
5. **Performance** — No N+1 queries, unbounded ops, render regressions, or runtime bottlenecks. Use the platform-specific performance skill when present, otherwise `performance-optimization`.

Categorize findings as Critical, Important, or Suggestion.
Output a structured review with specific file:line references and fix recommendations.
