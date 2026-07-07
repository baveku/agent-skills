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
- Do not invent missing Android, React Native, or KMP skills. Treat them as future expansion targets and use `source-driven-development` plus project-local commands.
- Slash commands and natural-language requests follow the same routing.

## Project Detection

Detect from files in the repo (or, in a monorepo, the directory the task touches — detect per-task, not per-repo).

| Signals present | Lane |
| --- | --- |
| `*.xcodeproj`, `*.xcworkspace`, `Package.swift`, `Info.plist`, `*.swift` | 🍎 Apple/Swift |
| `package.json` with react/vue/svelte/next/vite · `*.tsx`/`*.jsx` · `index.html` · tailwind config | 🌐 Frontend |
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

| Surface | Prefer |
| --- | --- |
| SwiftUI UI / patterns | `swiftui-ui-patterns`, `swiftui-view-refactor`, `swiftui-specialist` |
| SwiftUI review / idioms | `swiftui-pro`, `swiftui-whats-new-27`, `swiftui-liquid-glass` |
| SwiftUI performance | `swiftui-performance-audit` |
| App architecture | `swift-architecture` |
| Concurrency / data / security | `swift-concurrency-pro`, `swiftdata-pro`, `swift-security-expert` |
| Swift testing | `swift-testing-pro` |
| UIKit | `uikit-modernization`, `uikit-accessibility-auditor` |
| Accessibility | `swiftui-accessibility-auditor`, `ios-accessibility` |
| Runtime verification | `ios-debugger-agent`, `device-interaction` |
| Build / signing / security | `asc-xcode-build`, `asc-signing-setup`, `audit-xcode-security` |
| Release / TestFlight / crashes | `asc-release-flow`, `asc-testflight-orchestration`, `asc-submission-health`, `asc-crash-triage`, `asc-cli-usage` |
| App Store presence | `appstore-review`, `appstore-aso` |
| macOS / SPM packaging | `macos-spm-packaging` |
| C interop bounds safety | `c-bounds-safety` |

## 🌐 Frontend Bucket

| Surface | Prefer |
| --- | --- |
| Web UI / components / state | `frontend-ui-engineering` |
| Runtime verification | `browser-testing-with-devtools` |
| Performance (Core Web Vitals) | `webperf`, `performance-optimization` |
| Accessibility | `code-review-and-quality` (a11y axis) |

## ⚙️ Backend/API Bucket

| Surface | Prefer |
| --- | --- |
| API / interface contracts | `api-and-interface-design` |
| Security / untrusted input / auth | `security-and-hardening` |
| Observability / logging / tracing | `observability-and-instrumentation` |
| Performance (server / query) | `performance-optimization` |
| CI/CD / pipelines | `ci-cd-and-automation` |

> Backend has no dedicated persistence/messaging/database skill yet. For those surfaces use `source-driven-development` with the official docs plus project-local commands. Candidate future skills, not current routing targets.
