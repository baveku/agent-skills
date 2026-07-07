# Skill Routing

Always route work through skills before implementation.

## Classification

Classify every engineering request in this order:

1. **Project lane** (detect first): Apple/Swift, Frontend, or Backend/API. See Project Detection.
2. **Lifecycle**: define, plan, build, verify, review, ship.
3. **Surface**: UI, state, API, persistence, native bridge, build, testing, runtime verification, performance, security, accessibility, release.

## Routing Rules

- Detect the project lane before anything else, then select skills only from that lane's bucket plus the Shared bucket.
- Stay in lane: do not use another lane's skills unless the task is genuinely cross-cutting (e.g. a backend endpoint consumed by the frontend). Say so explicitly when you cross lanes.
- Specific beats generic: use lane platform skills before generic lifecycle skills when they apply.
- If a task matches a skill, invoke or follow that skill before editing files.
- Prefer one lifecycle skill, one lane skill, and one verification skill per turn.
- A per-project `AGENTS.md`/`CLAUDE.md` that pins a lane overrides detection — trust it and skip re-detection.
- Every current platform routes through a lane router: 🍎 `swift-best-practices`, 🌐 `web-best-practices`, ⚙️ `backend-best-practices`, 📱 `react-native-best-practices` / 📺 `react-native-tv-best-practices`, 🅺 `kotlin-best-practices`, 🤖 `android-best-practices`. For surfaces no router covers, use `source-driven-development` plus project-local commands instead of inventing skills.
- Slash commands and natural-language requests follow the same routing.

## Project Detection

Detect from files in the repo (or, in a monorepo, the directory the task touches — detect per-task, not per-repo).

| Signals present | Lane |
| --- | --- |
| `package.json` with react-native/expo · `react-native.config.js` · `app.json` with expo · `ios/` + `android/` dirs in a JS project | 📱 React Native (check BEFORE 🌐 — RN repos also contain react) |
| RN project targeting TV — react-native-tvos, Expo TV, Amazon Vega/Kepler, or TV-specific config | 📺 React Native TV |
| `*.xcodeproj`, `*.xcworkspace`, `Package.swift`, `Info.plist`, `*.swift` | 🍎 Apple/Swift |
| `package.json` with react/vue/svelte/next/vite · `*.tsx`/`*.jsx` · `index.html` · tailwind config | 🌐 Frontend |
| `AndroidManifest.xml` · `com.android.application`/`com.android.library` plugin in gradle · Jetpack Compose deps · `res/` layout dirs | 🤖 Android (check BEFORE 🅺 — Android repos are Kotlin repos too) |
| `*.kt` sources · `build.gradle.kts`/`settings.gradle.kts` · KMP module layout (`commonMain`/`androidMain`/`iosMain`) | 🅺 Kotlin (check BEFORE ⚙️ — Kotlin repos also match gradle signals) |
| `go.mod` · `Cargo.toml` · `pom.xml`/`build.gradle` · `pyproject.toml`/`requirements.txt` (fastapi/django/flask) · `package.json` with express/nest/fastify · `Dockerfile` + API routes and no UI | ⚙️ Backend/API |
| Multiple lanes match (monorepo) | Detect per-task from the touched directory |

If detection is ambiguous, state your best guess and ask before proceeding.

## Shared Bucket — all lanes (lifecycle, platform-agnostic)

| Intent | Skill |
| --- | --- |
| Define requirements | `spec-driven-development` |
| Plan tasks | `planning-and-task-breakdown` |
| Build a slice | `incremental-implementation` + `test-driven-development` |
| Fix/debug | `debugging-and-error-recovery` |
| Review | `code-review-and-quality` (deep: `review-swarm`) |
| Find latent bugs | `bug-hunt-swarm` |
| Simplify | `code-simplification` |
| Ship | `shipping-and-launch` |
| Version control | `git-workflow-and-versioning` |
| Document decisions | `documentation-and-adrs` |
| Ground in official docs | `source-driven-development` |
| High-stakes verification | `doubt-driven-development` |
| Retire / migrate code | `deprecation-and-migration` |
| Session/context setup | `context-engineering` |

## 🍎 Apple/Swift Bucket

All Apple-lane domain skills are consolidated under the `swift-best-practices` router skill. For any 🍎 task, open `swift-best-practices` first — its Routing Table maps every surface (SwiftUI UI/review/performance, architecture, concurrency, SwiftData, testing, UIKit, accessibility, security, runtime verification, Xcode build/signing, App Store release/TestFlight/ASO, macOS packaging, C interop) to the authoritative reference under `skills/swift-best-practices/references/<name>/SKILL.md`, which is read on demand. Do not duplicate that table here.

## 🌐 Frontend Bucket

All web domain skills are consolidated under the `web-best-practices` router. For any 🌐 task, open `web-best-practices` first — its table maps each surface (UI/components/state, browser runtime verification, performance) to a reference under `skills/web-best-practices/references/<name>/SKILL.md`, read on demand. For a full Core Web Vitals audit, use the `/webperf` command; `performance-optimization` remains a shared fallback.

## ⚙️ Backend/API Bucket

All backend domain skills are consolidated under the `backend-best-practices` router. For any ⚙️ task, open `backend-best-practices` first — its table maps each surface (API contracts, security/untrusted input/auth, observability, CI/CD) to a reference under `skills/backend-best-practices/references/<name>/SKILL.md`, read on demand. `performance-optimization` remains a shared fallback for server/query hotspots.

> Backend has no dedicated persistence/messaging/database reference yet. For those surfaces use `source-driven-development` with the official docs plus project-local commands.

## 🤖 Android Bucket

All Android domain skills are consolidated under the `android-best-practices` router (vendored from Google's android/skills). For any 🤖 task, open `android-best-practices` first — it covers Jetpack Compose UI (adaptive layouts, XML migration, Styles, Navigation 3, edge-to-edge), AGP builds, Perfetto profiling, R8, intent security, testing setup, CameraX, Play Billing/Engage, Wear OS, and XR. For KMP modules inside an Android project, combine with `kotlin-best-practices`.

## 🅺 Kotlin Bucket

All Kotlin domain skills are consolidated under the `kotlin-best-practices` router (vendored from JetBrains). For any 🅺 task, open `kotlin-best-practices` first — it covers Spring/JPA persistence in Kotlin, Java→Kotlin conversion, and KMP tooling migrations (AGP 9, CocoaPods→SPM, kotlinx immutable collections). For Kotlin backend API/security/observability surfaces, combine with `backend-best-practices`. Jetpack Compose UI is not covered yet — use `source-driven-development` plus official docs.

## 📱 React Native Bucket

| Surface | Prefer |
| --- | --- |
| Any RN performance/engineering surface — FPS, re-renders, TTI, bundle size, memory, animations, native modules | `react-native-best-practices` (Callstack; its internal references cover js-*/native-*/bundle-* topics) |
| TV targets — focus/D-pad navigation, 10-foot UI, TV playback/DRM, react-native-tvos / Expo TV / Vega | `react-native-tv-best-practices` |
