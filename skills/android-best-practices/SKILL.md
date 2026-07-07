---
name: android-best-practices
description: Provides official Android engineering guidelines for Jetpack Compose UI, navigation, camera, testing, security, performance profiling, Play integration, Wear OS, and XR. Use when any task touches native Android — AndroidManifest.xml, Compose/XML views, AGP builds, Perfetto traces, R8 rules, Play Billing, Credential Manager, or Android device targets (phone, foldable, Wear, TV, Auto, XR).
metadata:
  tags: android, jetpack-compose, kotlin, agp, perfetto, play, wear-os, xr, camerax
---

# Android Best Practices

## Overview

Routing hub for the 🤖 Android lane. Android domain skills (vendored from Google's [android/skills](https://github.com/android/skills)) live under [references/][references] and are read on demand. Detect the lane per `rules/skill-routing.md`, land here, open the reference your task needs.

These references are Google-authored and current — prefer them over training memory for API-version-sensitive topics (AGP 9, Navigation 3, Compose Styles, Play Billing).

## When to Use

- Any task touching a native Android project: Compose or XML UI, `AndroidManifest.xml`, Gradle/AGP builds.
- Android performance investigation with Perfetto traces or R8/keep-rule analysis.
- Play ecosystem work: Billing upgrades, Engage SDK.
- Device-family targets: Wear OS, XR display glasses, adaptive layouts for foldables/tablets/TV/Auto.

## Quick Reference

### Workflow

**Classify surface → Read the matching reference → Follow its workflow → Verify with Gradle builds/tests + on-device checks**

1. **Classify** the task with Problem → Reference Mapping below.
2. **Read** the reference's `SKILL.md` fully; most ship their own `references/` — follow them.
3. **Follow** its process; combine with one Shared-bucket lifecycle skill per `rules/skill-routing.md`.
4. **Verify** with the project's Gradle build/test commands and on-device/emulator checks.

### Review Guardrails

- Version-gate everything: AGP, Compose, Navigation, and Play Billing guidance changes across majors — confirm the project's versions before applying migration steps.
- KMP projects migrating AGP belong to `kotlin-best-practices` ([agp-9-upgrade][agp-9-upgrade] explicitly excludes KMP).
- Intent/component security review uses [android-intent-security][android-intent-security] — do not eyeball `AndroidManifest.xml` from memory.
- Performance claims need Perfetto evidence — [perfetto-trace-analysis][perfetto-trace-analysis] before optimization, not after.

## References

### UI & Navigation (Jetpack Compose)

| Reference | Impact | Description |
|-----------|--------|-------------|
| [adaptive][adaptive] | HIGH | Adaptive UI across phones, tablets, foldables, desktop, TV, Auto, XR |
| [migrate-xml-views-to-jetpack-compose][migrate-xml-views-to-jetpack-compose] | HIGH | Structured XML View → Compose migration workflow |
| [styles][styles] | MEDIUM | Jetpack Compose Styles API integration and theming |
| [navigation-3][navigation-3] | HIGH | Jetpack Navigation 3 — install, migration, deep links, backstacks, scenes |
| [edge-to-edge][edge-to-edge] | MEDIUM | Adaptive edge-to-edge support and inset troubleshooting |

### Build, Performance & Profiling

| Reference | Impact | Description |
|-----------|--------|-------------|
| [agp-9-upgrade][agp-9-upgrade] | HIGH | Android project → AGP 9 (NOT for KMP — that's `kotlin-best-practices`) |
| [r8-analyzer][r8-analyzer] | MEDIUM | R8 keep-rule analysis — redundancies, broad rules |
| [perfetto-trace-analysis][perfetto-trace-analysis] | HIGH | Root-cause latency/memory/jank from a Perfetto trace |
| [perfetto-sql][perfetto-sql] | MEDIUM | Natural language → Perfetto SQL against a local trace |

### Platform & Security

| Reference | Impact | Description |
|-----------|--------|-------------|
| [android-intent-security][android-intent-security] | CRITICAL | Intent security audit — manifest components, exported surfaces |
| [verified-email][verified-email] | MEDIUM | OTP-less verified email via Credential Manager API |
| [testing-setup][testing-setup] | HIGH | Testing strategy, libraries, infrastructure for native Android |
| [android-cli][android-cli] | MEDIUM | The `android` CLI — install and usage |
| [camerax][camerax] | MEDIUM | CameraX — capture, recording lifecycles, async wiring |
| [appfunctions][appfunctions] | LOW | AppFunctions — exposing app workflows to AI agents |

### Play & Device Families

| Reference | Impact | Description |
|-----------|--------|-------------|
| [play-billing-library-version-upgrade][play-billing-library-version-upgrade] | HIGH | Legacy Play Billing → latest stable PBL |
| [engage-sdk-integration][engage-sdk-integration] | MEDIUM | Play Engage SDK — integration and debugging |
| [wear-compose-m3][wear-compose-m3] | MEDIUM | Wear OS Compose Material3 |
| [display-glasses-with-jetpack-compose-glimmer][display-glasses-with-jetpack-compose-glimmer] | LOW | Projected Android XR apps with Compose Glimmer |

## Problem → Reference Mapping

| Problem | Start With |
|---------|------------|
| UI must work on tablets/foldables/TV | [adaptive][adaptive] |
| Legacy XML screens to modernize | [migrate-xml-views-to-jetpack-compose][migrate-xml-views-to-jetpack-compose] |
| Navigation rewrite or deep links | [navigation-3][navigation-3] |
| Build fails after AGP bump (non-KMP) | [agp-9-upgrade][agp-9-upgrade] |
| App janky / slow — have a trace | [perfetto-trace-analysis][perfetto-trace-analysis] → [perfetto-sql][perfetto-sql] |
| APK too big / R8 rules messy | [r8-analyzer][r8-analyzer] |
| Manifest security audit | [android-intent-security][android-intent-security] |
| No test infrastructure | [testing-setup][testing-setup] |
| Play Billing deprecation warnings | [play-billing-library-version-upgrade][play-billing-library-version-upgrade] |
| Camera feature | [camerax][camerax] |
| Wear OS app | [wear-compose-m3][wear-compose-m3] |
| KMP module in the project | cross-lane: `kotlin-best-practices` |
| Backend API this app consumes | cross-lane: `backend-best-practices` |

## Common Rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "I know Compose, no need for the reference." | Navigation 3, Styles API, and adaptive layouts are new and version-sensitive — training memory is stale here. |
| "The jank is obviously in the list." | Perfetto evidence first. Guessed optimizations waste cycles and hide the real cause. |
| "Manifest looks fine." | Exported components and intent filters have non-obvious attack surfaces — run the security reference. |

## Red Flags

- Writing Android code without opening any reference from this table.
- Applying AGP/Billing/Navigation migrations without confirming current versions.
- Performance work with no trace; security review with no manifest audit.

## Verification

- The reference matching the task's surface was read before implementation.
- Gradle build and tests pass; on-device/emulator behavior verified for UI changes.
- The reference's own Verification section is satisfied.

[references]: references/
[adaptive]: references/adaptive/SKILL.md
[migrate-xml-views-to-jetpack-compose]: references/migrate-xml-views-to-jetpack-compose/SKILL.md
[styles]: references/styles/SKILL.md
[navigation-3]: references/navigation-3/SKILL.md
[edge-to-edge]: references/edge-to-edge/SKILL.md
[agp-9-upgrade]: references/agp-9-upgrade/SKILL.md
[r8-analyzer]: references/r8-analyzer/SKILL.md
[perfetto-trace-analysis]: references/perfetto-trace-analysis/SKILL.md
[perfetto-sql]: references/perfetto-sql/SKILL.md
[android-intent-security]: references/android-intent-security/SKILL.md
[verified-email]: references/verified-email/SKILL.md
[testing-setup]: references/testing-setup/SKILL.md
[android-cli]: references/android-cli/SKILL.md
[camerax]: references/camerax/SKILL.md
[appfunctions]: references/appfunctions/SKILL.md
[play-billing-library-version-upgrade]: references/play-billing-library-version-upgrade/SKILL.md
[engage-sdk-integration]: references/engage-sdk-integration/SKILL.md
[wear-compose-m3]: references/wear-compose-m3/SKILL.md
[display-glasses-with-jetpack-compose-glimmer]: references/display-glasses-with-jetpack-compose-glimmer/SKILL.md
