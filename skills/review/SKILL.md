---
name: review
description: Run a five-axis code review before merge. Use when reviewing staged changes, recent commits, or a pull request.
---

# Review

## Overview

Antigravity alias for review. Follow `code-review-and-quality`.

## When to Use

- The user invokes `/review`.
- Staged changes, recent commits, or a pull request need review.
- A change is ready for quality gate checks.

## Process

1. Classify the platform and add the most specific review skill:

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

2. Review correctness, readability, architecture, security, and performance.
3. Lead with findings ordered by severity.
4. Include file:line references and concrete fixes.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "No findings means no output." | State no issues clearly and note residual risk. |
| "Style comments are enough." | Review prioritizes bugs, regressions, risk, and missing tests. |

## Red Flags

- Findings without file references.
- Generic advice without a concrete fix.
- Review ignores tests, security, or runtime risk.

## Verification

- Findings are ordered by severity.
- Each actionable finding has a specific location.
- Test gaps or residual risk are stated.

