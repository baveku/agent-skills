---
name: swift-best-practices
description: Provides Apple-platform engineering guidelines for SwiftUI, UIKit, Swift concurrency, SwiftData, testing, accessibility, security, Xcode builds, and App Store release. Use when any task touches Swift or an Apple OS target (iOS, macOS, watchOS, tvOS, visionOS) — building or reviewing UI, fixing Swift compile errors after an SDK update, debugging on simulator/device, signing, or shipping to TestFlight/App Store.
metadata:
  tags: swift, swiftui, uikit, swiftdata, xcode, ios, macos, appstore, testflight
---

# Swift Best Practices

## Overview

Routing hub for the 🍎 Apple/Swift lane. Every Apple domain skill lives under [references/][references] as a self-contained reference (each with its own `SKILL.md` and deeper references) and is read on demand — nothing is preloaded. Detect the lane per `rules/skill-routing.md`, land here, open exactly the references your task needs.

Several references are Apple-authored and **supersede training** (marked ⭐ below): when they conflict with what you think you know, the reference is correct.

## When to Use

- Any task touching Swift, SwiftUI, UIKit, SwiftData, Swift Testing, Xcode, or an Apple OS target.
- Apple-lane review, performance, accessibility, security, or release work.
- Swift compile errors after an SDK update (see Priority Triggers).

## Priority-Ordered Categories

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | SDK-update compile errors, Apple-authored guidance | CRITICAL | `swiftui-whats-new-27`, `swiftui-specialist` |
| 2 | SwiftUI UI, review, performance | HIGH | `swiftui-*` |
| 3 | Concurrency, persistence, architecture, testing | HIGH | `swift-*`, `swiftdata-*`, `modernize-tests` |
| 4 | Runtime verification & debugging | HIGH | `ios-debugger-agent`, `device-interaction` |
| 5 | Security & accessibility | MEDIUM-HIGH | `*-security-*`, `*-accessibility-*` |
| 6 | Build, signing, release, App Store | MEDIUM | `asc-*`, `appstore-*` |
| 7 | UIKit, packaging, C interop | MEDIUM | `uikit-*`, `macos-spm-packaging`, `c-bounds-safety` |

Impact labels are triage hints: CRITICAL rows are read-before-answering; the rest load when the task reaches that surface.

## Quick Reference

### Workflow

For any Apple-lane task: **Classify surface → Read the matching reference → Follow its workflow → Verify per its checklist**

1. **Classify**: find the task's surface in Problem → Reference Mapping below.
2. **Read**: open that reference's `SKILL.md` fully; follow its own deeper `references/*.md` when it points there.
3. **Follow**: apply the reference's process; combine with one Shared-bucket lifecycle skill per `rules/skill-routing.md`.
4. **Verify**: the reference's own Verification section must be satisfied.

If several rows match, read the most specific one first; add a second only when the task genuinely spans surfaces.

### Priority Triggers (read BEFORE answering)

| Symptom | Read first |
|---------|------------|
| `@State` view fails to compile after an SDK update — "used before being initialized", "invalid redeclaration of synthesized property", "extraneous argument label". Reordering init assignments is the WRONG fix. | [swiftui-whats-new-27][swiftui-whats-new-27] |
| `@Entry` warnings about closures or class types invalidating dependents — wrapping in an Equatable struct is WRONG. | [swiftui-specialist][swiftui-specialist] |
| "What's new in SwiftUI" for the 2027 SDKs; SDK-27 deprecations or source breaks. | [swiftui-whats-new-27][swiftui-whats-new-27] |

### Review Guardrails

- Do not answer SDK-update compile errors from training memory — the Priority Triggers rows exist because the obvious fix is wrong.
- Do not recommend SwiftUI performance fixes (memoization-style restructuring, list rewrites) without evidence from [swiftui-performance-audit][swiftui-performance-audit].
- Check deployment target before suggesting API-specific fixes; several references gate guidance by OS version.

## References

Full documentation in [references/][references] — each entry is a complete skill directory.

### SwiftUI (`swiftui-*`)

| Reference | Impact | Description |
|-----------|--------|-------------|
| [swiftui-whats-new-27][swiftui-whats-new-27] | CRITICAL ⭐ | SDK-27 APIs, @State macro migration, source breaks, deprecations |
| [swiftui-specialist][swiftui-specialist] | CRITICAL ⭐ | Apple best practices — Animatable, @Environment/@Entry, @Observable+Equatable, ForEach/List identity, localization, soft-deprecated APIs |
| [swiftui-ui-patterns][swiftui-ui-patterns] | HIGH | Screens, navigation, state, layout patterns |
| [swiftui-view-refactor][swiftui-view-refactor] | HIGH | View decomposition, state ownership, large view cleanup |
| [swiftui-pro][swiftui-pro] | HIGH | Code review, idioms, modern API usage |
| [swiftui-performance-audit][swiftui-performance-audit] | HIGH | Performance symptoms, slow lists, render regressions |
| [swiftui-liquid-glass][swiftui-liquid-glass] | MEDIUM | Liquid Glass design adoption |
| [swiftui-accessibility-auditor][swiftui-accessibility-auditor] | MEDIUM-HIGH | SwiftUI accessibility audit |

### Swift Core (`swift-*`)

| Reference | Impact | Description |
|-----------|--------|-------------|
| [swift-concurrency-pro][swift-concurrency-pro] | HIGH | async/await, actors, Sendable, isolation errors |
| [swiftdata-pro][swiftdata-pro] | HIGH | SwiftData models, queries, migration |
| [swift-architecture][swift-architecture] | HIGH | App architecture, module boundaries, dependency direction |
| [swift-testing-pro][swift-testing-pro] | HIGH | Swift Testing authoring and review |
| [modernize-tests][modernize-tests] | MEDIUM | Migrating XCTest to Swift Testing |
| [swift-security-expert][swift-security-expert] | MEDIUM-HIGH | Keychain, CryptoKit, ATS, entitlements |
| [c-bounds-safety][c-bounds-safety] | MEDIUM | C interop bounds safety |

### Runtime & Platform

| Reference | Impact | Description |
|-----------|--------|-------------|
| [ios-debugger-agent][ios-debugger-agent] | HIGH | Simulator/device runtime debugging |
| [device-interaction][device-interaction] | HIGH | Driving a simulator/device for verification |
| [ios-accessibility][ios-accessibility] | MEDIUM-HIGH | Platform-wide iOS accessibility |
| [uikit-modernization][uikit-modernization] | MEDIUM | UIKit modernization / migration toward SwiftUI |
| [uikit-accessibility-auditor][uikit-accessibility-auditor] | MEDIUM | UIKit accessibility audit |
| [macos-spm-packaging][macos-spm-packaging] | MEDIUM | macOS app packaging with SwiftPM |

### Build & Release (`asc-*`, `appstore-*`)

| Reference | Impact | Description |
|-----------|--------|-------------|
| [asc-xcode-build][asc-xcode-build] | HIGH | Xcode build, xcodebuild invocation |
| [asc-signing-setup][asc-signing-setup] | HIGH | Code signing, certificates, provisioning |
| [audit-xcode-security][audit-xcode-security] | MEDIUM-HIGH | Xcode project security audit |
| [asc-release-flow][asc-release-flow] | MEDIUM | Release flow to the App Store |
| [asc-testflight-orchestration][asc-testflight-orchestration] | MEDIUM | TestFlight distribution |
| [asc-submission-health][asc-submission-health] | MEDIUM | Submission health / review readiness |
| [asc-crash-triage][asc-crash-triage] | MEDIUM | Crash triage from App Store Connect |
| [asc-cli-usage][asc-cli-usage] | MEDIUM | App Store Connect CLI usage |
| [appstore-review][appstore-review] | MEDIUM | App Store review guidelines compliance |
| [appstore-aso][appstore-aso] | LOW | App Store optimization (ASO) |

## Problem → Reference Mapping

| Problem | Start With |
|---------|------------|
| Compile error after SDK update | [swiftui-whats-new-27][swiftui-whats-new-27] |
| Build a new SwiftUI screen/flow | [swiftui-ui-patterns][swiftui-ui-patterns] → [swiftui-specialist][swiftui-specialist] |
| SwiftUI view too big / messy state | [swiftui-view-refactor][swiftui-view-refactor] |
| Review SwiftUI code | [swiftui-pro][swiftui-pro] → [swiftui-specialist][swiftui-specialist] |
| Slow list / janky UI | [swiftui-performance-audit][swiftui-performance-audit] |
| Data race / actor isolation errors | [swift-concurrency-pro][swift-concurrency-pro] |
| Persistence design or migration | [swiftdata-pro][swiftdata-pro] |
| Write or migrate tests | [swift-testing-pro][swift-testing-pro] or [modernize-tests][modernize-tests] |
| Verify behavior on simulator/device | [device-interaction][device-interaction] → [ios-debugger-agent][ios-debugger-agent] |
| Accessibility audit | [swiftui-accessibility-auditor][swiftui-accessibility-auditor] or [uikit-accessibility-auditor][uikit-accessibility-auditor] → [ios-accessibility][ios-accessibility] |
| Keychain / crypto / entitlements | [swift-security-expert][swift-security-expert] |
| Build fails / signing broken | [asc-xcode-build][asc-xcode-build] → [asc-signing-setup][asc-signing-setup] |
| Ship to TestFlight / App Store | [asc-release-flow][asc-release-flow] → [asc-testflight-orchestration][asc-testflight-orchestration] |
| Crash reports to triage | [asc-crash-triage][asc-crash-triage] |
| App Store rejection risk | [appstore-review][appstore-review] |

## Common Rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "I know SwiftUI, I don't need the reference." | The ⭐ references are Apple-authored and supersede training. Skipping them produces confidently wrong fixes — especially the @State macro migration. |
| "The table row is enough context." | Rows are pointers, not guidance. The workflow, edge cases, and anti-patterns live in the reference. Read it. |
| "This task spans five rows, I'll read them all up front." | Read the most specific one first; pull others only when the task actually reaches that surface. |

## Red Flags

- Writing Apple-platform code without opening any reference from this table.
- Answering an SDK-update compile error from training memory instead of the Priority Triggers row.
- Loading many references speculatively instead of the one the task needs.

## Verification

- The reference matching the task's surface was read before implementation.
- The reference's own Verification section is satisfied.
- Only lane-relevant references were opened (no speculative bulk loading).

[references]: references/
[swiftui-whats-new-27]: references/swiftui-whats-new-27/SKILL.md
[swiftui-specialist]: references/swiftui-specialist/SKILL.md
[swiftui-ui-patterns]: references/swiftui-ui-patterns/SKILL.md
[swiftui-view-refactor]: references/swiftui-view-refactor/SKILL.md
[swiftui-pro]: references/swiftui-pro/SKILL.md
[swiftui-performance-audit]: references/swiftui-performance-audit/SKILL.md
[swiftui-liquid-glass]: references/swiftui-liquid-glass/SKILL.md
[swiftui-accessibility-auditor]: references/swiftui-accessibility-auditor/SKILL.md
[swift-concurrency-pro]: references/swift-concurrency-pro/SKILL.md
[swiftdata-pro]: references/swiftdata-pro/SKILL.md
[swift-architecture]: references/swift-architecture/SKILL.md
[swift-testing-pro]: references/swift-testing-pro/SKILL.md
[modernize-tests]: references/modernize-tests/SKILL.md
[swift-security-expert]: references/swift-security-expert/SKILL.md
[c-bounds-safety]: references/c-bounds-safety/SKILL.md
[ios-debugger-agent]: references/ios-debugger-agent/SKILL.md
[device-interaction]: references/device-interaction/SKILL.md
[ios-accessibility]: references/ios-accessibility/SKILL.md
[uikit-modernization]: references/uikit-modernization/SKILL.md
[uikit-accessibility-auditor]: references/uikit-accessibility-auditor/SKILL.md
[macos-spm-packaging]: references/macos-spm-packaging/SKILL.md
[asc-xcode-build]: references/asc-xcode-build/SKILL.md
[asc-signing-setup]: references/asc-signing-setup/SKILL.md
[audit-xcode-security]: references/audit-xcode-security/SKILL.md
[asc-release-flow]: references/asc-release-flow/SKILL.md
[asc-testflight-orchestration]: references/asc-testflight-orchestration/SKILL.md
[asc-submission-health]: references/asc-submission-health/SKILL.md
[asc-crash-triage]: references/asc-crash-triage/SKILL.md
[asc-cli-usage]: references/asc-cli-usage/SKILL.md
[appstore-review]: references/appstore-review/SKILL.md
[appstore-aso]: references/appstore-aso/SKILL.md
