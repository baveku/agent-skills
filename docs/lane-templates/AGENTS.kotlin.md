# Project AGENTS.md — 🅺 Kotlin lane

Copy this into the root of a Kotlin/KMP repo as `AGENTS.md` (or paste the
`## Skill lane` block into an existing `CLAUDE.md`). It pins the lane so the agent
skips project detection and never reaches for Apple, web, or Android-app skills.

## Skill lane

This is a **Kotlin** project (<!-- set: JVM backend / KMP library / KMP app -->).

- Use the **🅺 Kotlin bucket** + the **Shared bucket** from `rules/skill-routing.md`.
- Open the `kotlin-best-practices` router first — it covers Spring/JPA persistence
  in Kotlin, Java→Kotlin conversion, and KMP tooling migrations (AGP 9, CocoaPods→SPM,
  kotlinx immutable collections).
- For backend API/security/observability surfaces, combine with `backend-best-practices`
  (cross-lane is expected for Kotlin servers).
- Jetpack Compose UI is NOT covered by this lane — an Android app repo should pin the
  🤖 Android lane instead (`AGENTS.android.md`); a bare Compose surface here uses
  `source-driven-development` + official docs.

## Fast picks

- JPA entity design/review → `kotlin-best-practices/references/kotlin-backend-jpa-entity-mapping`
- Convert Java → Kotlin → `.../kotlin-tooling-java-to-kotlin`
- KMP + AGP 9 build breaks → `.../kotlin-tooling-agp9-migration`
- CocoaPods → SPM → `.../kotlin-tooling-cocoapods-spm-migration`
- API contracts / auth / logging → `backend-best-practices` (cross-lane)
