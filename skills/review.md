---
name: review
description: Run a five-axis code review before merge. Use when reviewing staged changes, recent commits, or a pull request.
---

# Review

Follow `code-review-and-quality`.

Before reviewing, classify the platform and add the most specific review skill:

| Scope | Add this skill |
| --- | --- |
| SwiftUI code | `swiftui-pro` |
| SwiftUI performance symptoms or large dynamic lists | `swiftui-performance-audit` |
| SwiftUI accessibility | `swiftui-accessibility-auditor` |
| Swift concurrency | `swift-concurrency-pro` or `swift-concurrency-expert` |
| SwiftData | `swiftdata-pro` |
| Apple security, Keychain, CryptoKit, ATS, entitlements | `swift-security-expert` |
| Web security | `security-and-hardening` |
| Web performance / Core Web Vitals | `/webperf` or `performance-optimization` |

Review correctness, readability, architecture, security, and performance. Lead with findings ordered by severity and include file:line references.
