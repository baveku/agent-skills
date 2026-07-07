# Project AGENTS.md — 🍎 Apple/Swift lane

Copy this into the root of a Swift/SwiftUI/UIKit repo as `AGENTS.md` (or paste the
`## Skill lane` block into an existing `CLAUDE.md`). It pins the lane so the agent
skips project detection and never reaches for Frontend or Backend skills.

## Skill lane

This is an **Apple/Swift** project (Xcode, SwiftUI/UIKit, Swift Package Manager).

- Use the **🍎 Apple/Swift bucket** + the **Shared bucket** from `rules/skill-routing.md`.
- Ignore Frontend and Backend/API skills, and all React Native / Android / web tooling.
- Prefer platform skills over generic lifecycle skills: e.g. `swiftui-performance-audit`
  before `performance-optimization`, `swift-testing-pro` before generic TDD guidance.
- Runtime verification goes through `ios-debugger-agent` / `device-interaction`, not browser tools.

## Fast picks

Open the `swift-best-practices` router first — its table maps every surface to the reference to read. Direct paths for the most common ones:

- UI work → `swift-best-practices/references/swiftui-ui-patterns`, `.../swiftui-view-refactor`, `.../swiftui-specialist`
- Review → `swift-best-practices/references/swiftui-pro`
- Concurrency / data → `.../swift-concurrency-pro`, `.../swiftdata-pro`
- Build / signing / release → `.../asc-xcode-build`, `.../asc-signing-setup`, `.../asc-release-flow`
