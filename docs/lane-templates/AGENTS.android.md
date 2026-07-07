# Project AGENTS.md — 🤖 Android lane

Copy this into the root of a native Android repo as `AGENTS.md` (or paste the
`## Skill lane` block into an existing `CLAUDE.md`). It pins the lane so the agent
skips project detection and never reaches for Apple, web, or React Native skills.

## Skill lane

This is a **native Android** project (Kotlin, Jetpack Compose<!-- /XML Views -->, AGP).

- Use the **🤖 Android bucket** + the **Shared bucket** from `rules/skill-routing.md`.
- Open the `android-best-practices` router first — its Problem → Reference Mapping
  covers Compose UI (adaptive, XML migration, Styles, Navigation 3, edge-to-edge),
  AGP builds, Perfetto profiling, R8, intent security, testing setup, CameraX,
  Play Billing/Engage, Wear OS, and XR.
- These references are Google-authored and version-sensitive — confirm the project's
  AGP/Compose/Billing versions before applying migration steps.
- KMP modules in this repo → combine with `kotlin-best-practices` (cross-lane is
  expected; note the KMP AGP-9 migration lives there, NOT in `agp-9-upgrade`).
- Performance claims need Perfetto evidence; manifest security review goes through
  `android-intent-security`, not eyeballing.

## Fast picks

- Adaptive UI (tablet/foldable/TV) → `android-best-practices/references/adaptive`
- XML → Compose migration → `.../migrate-xml-views-to-jetpack-compose`
- Navigation rewrite / deep links → `.../navigation-3`
- Jank/latency with a trace → `.../perfetto-trace-analysis`
- AGP 9 upgrade (non-KMP) → `.../agp-9-upgrade`
- Manifest/intent security audit → `.../android-intent-security`
