---
name: using-agent-skills
description: Discovers and invokes agent skills. Use when starting a session or when you need to discover which skill applies to the current task. This is the meta-skill that governs how all other skills are discovered and invoked.
---

# Using Agent Skills

## Overview

Agent Skills is a collection of engineering workflow skills organized by development phase. Each skill encodes a specific process that senior engineers follow. This meta-skill helps you discover and apply the right skill for your current task.

## Skill Discovery

When a task arrives, classify it before choosing skills (`rules/skill-routing.md` is the canonical policy):

1. **Project lane** (detect first) — 🍎 Apple/Swift, 🌐 Frontend, ⚙️ Backend/API, 📱 React Native, 📺 React Native TV, 🅺 Kotlin, or 🤖 Android. Detect from repo files (`package.json` with react-native/expo → 📱, checked BEFORE 🌐 since RN repos also contain react; TV-targeted RN → 📺; `*.xcodeproj`/`Package.swift` → 🍎; react/vue/vite `package.json` or `*.tsx` → 🌐; `AndroidManifest.xml`/`com.android.application`/Compose deps → 🤖, checked BEFORE 🅺 since Android repos are Kotlin repos too; `*.kt`/`build.gradle.kts`/KMP layout → 🅺, checked BEFORE ⚙️ since Kotlin repos also match gradle; `go.mod`/`Cargo.toml`/`pyproject.toml`/server `package.json`/`Dockerfile`+API → ⚙️); detect per directory in a monorepo. A per-project `AGENTS.md` pinning a lane overrides detection.
2. **Lifecycle** — define, plan, build, verify, review, ship.
3. **Surface** — UI, state, API, persistence, native bridge, build, testing, runtime verification, performance, security, accessibility, release.

Stay in the detected lane: use its bucket plus the Shared (lifecycle) bucket only. Prefer the most specific available lane skill. Apple-platform, React Native, Kotlin/KMP, and native Android are all current production targets, each behind a lane router. For surfaces no router covers, do not invent skills — use `source-driven-development` plus project-local commands.

```
Task arrives
    │
    ├── Don't know what you want yet? ──────→ interview-me
    ├── Have a rough concept, need variants? → idea-refine
    ├── New project/feature/change? ──→ spec-driven-development
    ├── Have a spec, need tasks? ──────→ planning-and-task-breakdown
    ├── Implementing code? ────────────→ incremental-implementation
    │   ├── Web UI? ──────────────────→ frontend-ui-engineering
    │   ├── SwiftUI UI? ───────────────→ swiftui-ui-patterns / swiftui-view-refactor
    │   ├── API work? ────────────────→ api-and-interface-design
    │   ├── Need better context? ─────→ context-engineering
    │   ├── Need doc-verified code? ───→ source-driven-development
    │   └── Stakes high / unfamiliar code? ──→ doubt-driven-development
    ├── Writing/running tests? ────────→ test-driven-development
    │   ├── Web runtime? ──────────────→ browser-testing-with-devtools
    │   ├── iOS runtime? ──────────────→ ios-debugger-agent / device-interaction
    │   └── Swift Testing? ────────────→ swift-testing-pro if present
    ├── Something broke? ──────────────→ debugging-and-error-recovery
    ├── Reviewing code? ───────────────→ code-review-and-quality
    │   ├── Too complex? ─────────────→ code-simplification
    │   ├── SwiftUI review? ──────────→ swiftui-pro
    │   ├── Security concerns? ───────→ Apple security skill, else security-and-hardening
    │   └── Performance concerns? ────→ Apple performance skill, else performance-optimization
    ├── Committing/branching? ─────────→ git-workflow-and-versioning
    ├── CI/CD pipeline work? ──────────→ ci-cd-and-automation
    ├── Deprecating/migrating? ────────→ deprecation-and-migration
    ├── Writing docs/ADRs? ───────────→ documentation-and-adrs
    ├── Adding logs/metrics/alerts? ───→ observability-and-instrumentation
    └── Deploying/launching? ─────────→ shipping-and-launch
```

## Core Operating Behaviors

These behaviors apply at all times, across all skills. They are non-negotiable.

### 1. Surface Assumptions

Before implementing anything non-trivial, explicitly state your assumptions:

```
ASSUMPTIONS I'M MAKING:
1. [assumption about requirements]
2. [assumption about architecture]
3. [assumption about scope]
→ Correct me now or I'll proceed with these.
```

Don't silently fill in ambiguous requirements. The most common failure mode is making wrong assumptions and running with them unchecked. Surface uncertainty early — it's cheaper than rework.

### 2. Manage Confusion Actively

When you encounter inconsistencies, conflicting requirements, or unclear specifications:

1. **STOP.** Do not proceed with a guess.
2. Name the specific confusion.
3. Present the tradeoff or ask the clarifying question.
4. Wait for resolution before continuing.

**Bad:** Silently picking one interpretation and hoping it's right.
**Good:** "I see X in the spec but Y in the existing code. Which takes precedence?"

### 3. Push Back When Warranted

You are not a yes-machine. When an approach has clear problems:

- Point out the issue directly
- Explain the concrete downside (quantify when possible — "this adds ~200ms latency" not "this might be slower")
- Propose an alternative
- Accept the human's decision if they override with full information

Sycophancy is a failure mode. "Of course!" followed by implementing a bad idea helps no one. Honest technical disagreement is more valuable than false agreement.

### 4. Enforce Simplicity

Your natural tendency is to overcomplicate. Actively resist it.

Before finishing any implementation, ask:
- Can this be done in fewer lines?
- Are these abstractions earning their complexity?
- Would a staff engineer look at this and say "why didn't you just..."?

If you build 1000 lines and 100 would suffice, you have failed. Prefer the boring, obvious solution. Cleverness is expensive.

### 5. Maintain Scope Discipline

Touch only what you're asked to touch.

Do NOT:
- Remove comments you don't understand
- "Clean up" code orthogonal to the task
- Refactor adjacent systems as a side effect
- Delete code that seems unused without explicit approval
- Add features not in the spec because they "seem useful"

Your job is surgical precision, not unsolicited renovation.

### 6. Verify, Don't Assume

Every skill includes a verification step. A task is not complete until verification passes. "Seems right" is never sufficient — there must be evidence (passing tests, build output, runtime data).

Per-skill verification is the local check. The project-wide bar that applies to *every* change, regardless of which skill is active, is the Definition of Done: tests pass, no regressions, behavior verified at runtime, docs updated. See `references/definition-of-done.md`. It complements each task's acceptance criteria rather than replacing them.

## Failure Modes to Avoid

These are the subtle errors that look like productivity but create problems:

1. Making wrong assumptions without checking
2. Not managing your own confusion — plowing ahead when lost
3. Not surfacing inconsistencies you notice
4. Not presenting tradeoffs on non-obvious decisions
5. Being sycophantic ("Of course!") to approaches with clear problems
6. Overcomplicating code and APIs
7. Modifying code or comments orthogonal to the task
8. Removing things you don't fully understand
9. Building without a spec because "it's obvious"
10. Skipping verification because "it looks right"

## Skill Rules

1. **Check for an applicable skill before starting work.** Skills encode processes that prevent common mistakes.

2. **Skills are workflows, not suggestions.** Follow the steps in order. Don't skip verification steps.

3. **Specific beats generic.** A SwiftUI performance task uses `swiftui-performance-audit` before `performance-optimization`; a web runtime task uses `browser-testing-with-devtools` before generic test guidance.

4. **Limit active skills.** Prefer one lifecycle skill, one lane skill, and one verification skill per turn. Add more only when the user asks for a full workflow or the change is production-bound and cross-cutting.

5. **Multiple skills can apply.** A feature implementation might involve `idea-refine` → `spec-driven-development` → `planning-and-task-breakdown` → `incremental-implementation` → `test-driven-development` → `code-review-and-quality` → `code-simplification` → `shipping-and-launch` in sequence.

6. **When in doubt, start with a spec.** If the task is non-trivial and there's no spec, begin with `spec-driven-development`.

7. **Do not invent missing skills.** For surfaces no lane router covers, combine the generic lifecycle skill with `source-driven-development`, local project docs, and the platform's build/test commands. (React Native routes through `react-native-best-practices` / `react-native-tv-best-practices`; Kotlin/KMP through `kotlin-best-practices`; native Android through `android-best-practices`.)

## Lane Routing

| Lane | Surface | Prefer | Fallback |
| --- | --- | --- | --- |
| 🍎 | Any Apple/Swift surface | `swift-best-practices` — lane router, references read on demand | generic Shared-bucket skills |
| 🌐 | Any web frontend surface | `web-best-practices` — lane router (UI, browser verification); `/webperf` for CWV audits | `performance-optimization` |
| ⚙️ | Any backend/API surface | `backend-best-practices` — lane router (contracts, security, observability, CI/CD) | `performance-optimization` for server hotspots |
| 📱 | Any React Native surface | `react-native-best-practices` — FPS, re-renders, TTI, bundle, memory, native modules | generic Shared-bucket skills |
| 📺 | React Native TV targets | `react-native-tv-best-practices` — focus/D-pad, 10-foot UI, TV playback | `react-native-best-practices` |
| 🅺 | Kotlin / KMP | `kotlin-best-practices` — Spring/JPA persistence, Java→Kotlin, KMP tooling migrations | `backend-best-practices` for API/security surfaces |
| 🤖 | Native Android | `android-best-practices` — Compose UI, navigation, AGP, Perfetto, security, testing, Play, Wear, XR | `kotlin-best-practices` for KMP modules |

## Lifecycle Sequence

For a complete feature, the typical skill sequence is:

```
1.  interview-me                → Extract what the user actually wants
2.  idea-refine                 → Refine vague ideas
3.  spec-driven-development     → Define what we're building
4.  planning-and-task-breakdown → Break into verifiable chunks
5.  context-engineering         → Load the right context
6.  source-driven-development   → Verify against official docs
7.  incremental-implementation  → Build slice by slice
8.  observability-and-instrumentation → Instrument as you build (runs parallel with 7-9, not after)
9.  doubt-driven-development    → Cross-examine non-trivial decisions in-flight
10. test-driven-development     → Prove each slice works
11. code-review-and-quality     → Review before merge
12. code-simplification         → Reduce unnecessary complexity while preserving behavior
13. git-workflow-and-versioning → Clean commit history
14. documentation-and-adrs      → Document decisions
15. deprecation-and-migration   → Retire old systems and move users safely when needed
16. shipping-and-launch         → Deploy safely
```

Not every task needs every skill. A bug fix might only need: `debugging-and-error-recovery` → `test-driven-development` → `code-review-and-quality`.

## Quick Reference

| Phase | Skill | One-Line Summary |
|-------|-------|-----------------|
| Define | interview-me | Surface what the user actually wants before any plan, spec, or code exists |
| Define | idea-refine | Refine ideas through structured divergent and convergent thinking |
| Define | spec-driven-development | Requirements and acceptance criteria before code |
| Plan | planning-and-task-breakdown | Decompose into small, verifiable tasks |
| Build | incremental-implementation | Thin vertical slices, test each before expanding |
| Build | source-driven-development | Verify against official docs before implementing |
| Build | doubt-driven-development | Adversarial fresh-context review of every non-trivial decision |
| Build | context-engineering | Right context at the right time |
| Build | frontend-ui-engineering | Production-quality web UI with accessibility; fallback for unknown UI |
| Build | swiftui-ui-patterns | SwiftUI-native UI, navigation, state, and layout patterns |
| Build | swiftui-view-refactor | SwiftUI refactoring, state ownership, and view decomposition |
| Build | api-and-interface-design | Stable interfaces with clear contracts |
| Verify | test-driven-development | Failing test first, then make it pass |
| Verify | browser-testing-with-devtools | Web runtime verification with Chrome DevTools MCP |
| Verify | ios-debugger-agent / device-interaction | iOS simulator/device runtime verification when available |
| Verify | swift-testing-pro | Swift Testing guidance when available |
| Verify | debugging-and-error-recovery | Reproduce → localize → fix → guard |
| Review | code-review-and-quality | Five-axis review with quality gates |
| Review | code-simplification | Preserve behavior while reducing unnecessary complexity |
| Review | security-and-hardening | OWASP prevention, input validation, least privilege |
| Review | performance-optimization | Measure first, optimize only what matters |
| Review | swiftui-pro | SwiftUI-specific review |
| Review | swiftui-performance-audit | SwiftUI-specific performance audit |
| Review | swiftui-accessibility-auditor | SwiftUI accessibility audit |
| Ship | git-workflow-and-versioning | Atomic commits, clean history |
| Ship | ci-cd-and-automation | Automated quality gates on every change |
| Ship | deprecation-and-migration | Remove old systems and migrate users safely |
| Ship | documentation-and-adrs | Document the why, not just the what |
| Ship | observability-and-instrumentation | Structured logs, RED metrics, traces, symptom-based alerts |
| Ship | shipping-and-launch | Pre-launch checklist, monitoring, rollback plan |
