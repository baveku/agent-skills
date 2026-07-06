# Skill Routing

Always route work through skills before implementation.

## Classification

Classify every engineering request in this order:

1. Lifecycle: define, plan, build, verify, review, ship.
2. Platform: web, Apple platform, or shared backend/library.
3. Surface: UI, state, API, persistence, native bridge, build, testing, runtime verification, performance, security, accessibility, release.

## Routing Rules

- If a task matches a skill, invoke or follow that skill before editing files.
- Specific beats generic: use Apple and web skills before generic lifecycle skills when they apply.
- Prefer one lifecycle skill, one platform/domain skill, and one verification skill per turn.
- Do not invent missing Android, React Native, or KMP skills. Treat them as future expansion targets and use source-driven development plus project-local commands.
- Slash commands and natural-language requests follow the same routing.

## Lifecycle Map

| Intent | Skill |
| --- | --- |
| Define requirements | `spec-driven-development` |
| Plan tasks | `planning-and-task-breakdown` |
| Build a slice | `incremental-implementation` + `test-driven-development` |
| Fix/debug | `debugging-and-error-recovery` |
| Review | `code-review-and-quality` |
| Simplify | `code-simplification` |
| Ship | `shipping-and-launch` |

## Platform Map

| Surface | Prefer |
| --- | --- |
| Web UI | `frontend-ui-engineering` |
| Web runtime verification | `browser-testing-with-devtools` |
| SwiftUI UI | `swiftui-ui-patterns`, `swiftui-view-refactor` |
| SwiftUI review | `swiftui-pro` |
| SwiftUI performance | `swiftui-performance-audit` |
| iOS accessibility | `swiftui-accessibility-auditor`, `ios-accessibility` |
| iOS runtime verification | `ios-debugger-agent`, `device-interaction` |
| Swift concurrency / data / security | `swift-concurrency-pro`, `swiftdata-pro`, `swift-security-expert` |
