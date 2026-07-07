---
name: kotlin-best-practices
description: Provides Kotlin engineering guidelines for Spring/JPA persistence, Java-to-Kotlin conversion, and Kotlin Multiplatform tooling migrations (AGP 9, CocoaPods to SPM, kotlinx immutable collections). Use when any task touches Kotlin — .kt sources, build.gradle.kts, KMP modules, JPA entities in Kotlin, or converting Java code to Kotlin.
metadata:
  tags: kotlin, kmp, kotlin-multiplatform, spring, jpa, gradle, agp, java-to-kotlin
---

# Kotlin Best Practices

## Overview

Routing hub for the 🅺 Kotlin lane. Kotlin domain skills (vendored from JetBrains' [Kotlin/kotlin-agent-skills](https://github.com/Kotlin/kotlin-agent-skills)) live under [references/][references] and are read on demand. Detect the lane per `rules/skill-routing.md`, land here, open the reference your task needs.

Coverage today is persistence + migrations/tooling. Android-native UI (Jetpack Compose) and broader KMP app guidance are not covered yet — for those use `source-driven-development` with the official docs plus project-local commands.

## When to Use

- Working with Kotlin sources (`.kt`), `build.gradle.kts`, or KMP module structure.
- Creating or reviewing JPA/Hibernate entities written in Kotlin (Spring Data).
- Converting Java code to idiomatic Kotlin.
- KMP tooling migrations: AGP 9 upgrade, CocoaPods → Swift Package Manager, kotlinx.collections.immutable 0.5.x.

## Quick Reference

### Workflow

**Classify surface → Read the matching reference → Follow its workflow → Verify with Gradle builds/tests**

1. **Classify** the task with Problem → Reference Mapping below.
2. **Read** the reference's `SKILL.md` fully; several ship their own `references/` and `scripts/` — follow them.
3. **Follow** its process; combine with one Shared-bucket lifecycle skill per `rules/skill-routing.md`.
4. **Verify** with the project's Gradle build and test commands.

### Review Guardrails

- Kotlin JPA entities are not plain data classes — identity/equality and lazy loading have Kotlin-specific traps; check [kotlin-backend-jpa-entity-mapping][kotlin-backend-jpa-entity-mapping] before reviewing entity code.
- Migration skills are version-gated: confirm the project's current AGP / kotlinx-collections version before applying migration steps.
- Do not hand-convert Java files from memory — [kotlin-tooling-java-to-kotlin][kotlin-tooling-java-to-kotlin] handles framework-specific (Spring, Lombok, Hibernate, Jackson) conversion pitfalls.

## References

| Reference | Impact | Description |
|-----------|--------|-------------|
| [kotlin-backend-jpa-entity-mapping][kotlin-backend-jpa-entity-mapping] | HIGH | Kotlin persistence for Spring Data JPA/Hibernate — entity design, identity/equality, relationships, fetch plans, ORM traps |
| [kotlin-tooling-java-to-kotlin][kotlin-tooling-java-to-kotlin] | HIGH | Framework-aware Java → idiomatic Kotlin conversion (Spring, Lombok, Hibernate, Jackson, Micronaut, Quarkus) |
| [kotlin-tooling-agp9-migration][kotlin-tooling-agp9-migration] | MEDIUM | KMP projects → Android Gradle Plugin 9.0+ — plugin replacement, module splitting, DSL migration |
| [kotlin-tooling-cocoapods-spm-migration][kotlin-tooling-cocoapods-spm-migration] | MEDIUM | KMP iOS integration: CocoaPods → Swift Package Manager (`swiftPMDependencies` DSL) |
| [kotlin-tooling-immutable-collections-0-5-x-migration][kotlin-tooling-immutable-collections-0-5-x-migration] | LOW | kotlinx.collections.immutable 0.3/0.4 → 0.5.x method renames (KEEP-0459) |

## Problem → Reference Mapping

| Problem | Start With |
|---------|------------|
| New or reviewed JPA entity in Kotlin | [kotlin-backend-jpa-entity-mapping][kotlin-backend-jpa-entity-mapping] |
| "Convert this Java file/module to Kotlin" | [kotlin-tooling-java-to-kotlin][kotlin-tooling-java-to-kotlin] |
| Build fails after AGP upgrade / KMP+AGP incompatibility | [kotlin-tooling-agp9-migration][kotlin-tooling-agp9-migration] |
| KMP iOS deps still on CocoaPods | [kotlin-tooling-cocoapods-spm-migration][kotlin-tooling-cocoapods-spm-migration] |
| Compile errors after kotlinx-collections upgrade | [kotlin-tooling-immutable-collections-0-5-x-migration][kotlin-tooling-immutable-collections-0-5-x-migration] |
| Kotlin backend API/security/observability | cross-lane: `backend-best-practices` (contracts, hardening, observability) |
| Jetpack Compose UI | not covered yet — `source-driven-development` + official docs |

## Common Rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "Kotlin data class works fine as a JPA entity." | Identity/equality and lazy-loading traps are exactly what the JPA reference exists for. Read it before modeling entities. |
| "J2K conversion is mechanical." | Framework annotations (Lombok, Jackson, Spring) change semantics in conversion. Use the reference's framework-aware process. |
| "I'll apply the migration steps from memory." | Migration skills are version-gated and script-assisted. Follow the reference's steps and scripts. |

## Red Flags

- Modeling Kotlin JPA entities without opening the persistence reference.
- Hand-converting Java to Kotlin in framework-heavy code without the conversion reference.
- Applying AGP/collections migrations without confirming current versions.

## Verification

- The reference matching the task's surface was read before implementation.
- Gradle build and tests pass after the change.
- The reference's own Verification section is satisfied.

[references]: references/
[kotlin-backend-jpa-entity-mapping]: references/kotlin-backend-jpa-entity-mapping/SKILL.md
[kotlin-tooling-java-to-kotlin]: references/kotlin-tooling-java-to-kotlin/SKILL.md
[kotlin-tooling-agp9-migration]: references/kotlin-tooling-agp9-migration/SKILL.md
[kotlin-tooling-cocoapods-spm-migration]: references/kotlin-tooling-cocoapods-spm-migration/SKILL.md
[kotlin-tooling-immutable-collections-0-5-x-migration]: references/kotlin-tooling-immutable-collections-0-5-x-migration/SKILL.md
