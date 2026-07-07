# Agent Skills

**Production-grade engineering skills for AI coding agents, extended with platform lanes for Apple, Android, Kotlin/KMP, React Native, web, and backend development.**

This is a fork of [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) that keeps the original production engineering lifecycle and adds **lane-based routing**: every platform's domain skills are consolidated under a `<lane>-best-practices` router skill whose references are read on demand — so hosts with tight startup budgets (Antigravity) load a handful of routers instead of a hundred descriptions, while Claude/Codex installs keep full per-skill discovery.

Skills encode the workflows, quality gates, and best practices that senior engineers use when building software. They are packaged so AI agents follow them consistently across web, backend, and mobile development.

```
  DEFINE          PLAN           BUILD          VERIFY         REVIEW          SHIP
 ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐
 │ Idea │ ───▶ │ Spec │ ───▶ │ Code │ ───▶ │ Test │ ───▶ │  QA  │ ───▶ │  Go  │
 │Refine│      │  PRD │      │ Impl │      │Debug │      │ Gate │      │ Live │
 └──────┘      └──────┘      └──────┘      └──────┘      └──────┘      └──────┘
  /spec          /plan          /build        /test         /review       /ship
```

---

## Commands

9 entry points map to the development workflow. They work as Claude Code command files, Antigravity skill-generated slash commands, or natural-language workflows through `AGENTS.md` and `using-agent-skills`.

| What you're doing | Command | Key principle |
|-------------------|---------|---------------|
| Pin the project's platform lane | `/lane-init` | Detect once, write it down |
| Define what to build | `/spec` | Spec before code |
| Plan how to build it | `/plan` | Small, atomic tasks |
| Build incrementally | `/build` | One slice at a time |
| Prove it works | `/test` | Tests are proof |
| Review before merge | `/review` | Improve code health |
| Audit web performance | `/webperf` | Measure before you optimize |
| Simplify the code | `/code-simplify` | Clarity over cleverness |
| Ship to production | `/ship` | Faster is safer |

Want fewer manual steps once the spec exists? **`/build auto`** generates the plan and implements every task in a single approved pass — you approve the plan once, then it runs autonomously. It removes the human stepping *between* tasks, not the verification: every task is still test-driven and committed individually, and it pauses on failures or risky steps.

Skills also activate automatically: the agent detects the project's lane (per `rules/skill-routing.md`), opens that lane's router, and reads only the references the task needs. Run `/lane-init` once per project to pin the lane into `AGENTS.md` and skip detection entirely (manual templates: [docs/lane-templates/](docs/lane-templates/)). Surfaces no router covers fall back to `source-driven-development` plus local project docs.

### Platform lanes

This fork adds lane-based routing for:

- **iOS / SwiftUI** — SwiftUI UI patterns, view refactors, performance audits, accessibility, Swift concurrency, SwiftData, Apple security, simulator/device verification.
- **macOS / SwiftPM** — Swift package workflows, app packaging, signing, notarization, and desktop SwiftUI patterns.
- **App Store Connect** — build upload, TestFlight orchestration, submission health, release flow, signing setup, crash triage, and ASO/review workflows.
- **React Native** — Callstack performance guidelines (FPS, TTI, bundle size, memory, re-renders) via `react-native-best-practices`, plus TV targets (focus/D-pad, 10-foot UI, playback) via `react-native-tv-best-practices`.
- **Kotlin / KMP** — JetBrains skills for Spring/JPA persistence in Kotlin, Java→Kotlin conversion, and KMP tooling migrations (AGP 9, CocoaPods→SPM) via `kotlin-best-practices`.
- **Android** — Google's official skills for Jetpack Compose UI, Navigation 3, AGP builds, Perfetto profiling, intent security, testing, Play Billing/Engage, Wear OS, and XR via `android-best-practices`.

Platform skills are vendored under `skills/` and updated manually via `skills-manifest.json`. Domain skills are consolidated under lane routers (`swift-best-practices`, `web-best-practices`, `backend-best-practices`, `kotlin-best-practices`, `android-best-practices`) whose `references/` are read on demand.

---

## Quick Start

<details>
<summary><b>Claude Code (recommended)</b></summary>

**Marketplace install:**

```
/plugin marketplace add baveku/agent-skills
/plugin install agent-skills@baveku-agent-skills
```

> **SSH errors?** The marketplace clones repos via SSH. If you don't have SSH keys set up on GitHub, either [add your SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) or use the full HTTPS URL to force the HTTPS cloning:
> ```bash
> /plugin marketplace add https://github.com/baveku/agent-skills.git
> /plugin install agent-skills@baveku-agent-skills
> ```

**Local / development:**

```bash
git clone https://github.com/baveku/agent-skills.git
claude --plugin-dir /path/to/agent-skills
```

</details>

<details>
<summary><b>Cursor</b></summary>

Copy any `SKILL.md` into `.cursor/rules/`, or reference the full `skills/` directory. See [docs/cursor-setup.md](docs/cursor-setup.md).

</details>

<details>
<summary><b>Antigravity CLI</b></summary>

Install the repo root as the Antigravity plugin. Antigravity generates slash commands from markdown skill aliases, not TOML command files. See [docs/antigravity-setup.md](docs/antigravity-setup.md).

**Install from the repo:**

```bash
agy plugin install https://github.com/baveku/agent-skills.git
```

**Install from a local clone:**

```bash
git clone https://github.com/baveku/agent-skills.git
agy plugin install ./agent-skills
```

</details>

<details>
<summary><b>Windsurf</b></summary>

Add skill contents to your Windsurf rules configuration. See [docs/windsurf-setup.md](docs/windsurf-setup.md).

</details>

<details>
<summary><b>OpenCode</b></summary>

Uses agent-driven skill execution via AGENTS.md and the `skill` tool.

See [docs/opencode-setup.md](docs/opencode-setup.md).

</details>

<details>
<summary><b>GitHub Copilot</b></summary>

Use agent definitions from `agents/` as Copilot personas and skill content in `.github/copilot-instructions.md`. See [docs/copilot-setup.md](docs/copilot-setup.md).

</details>

<details>
  <summary><b>Kiro IDE & CLI </b></summary>
  Skills for Kiro reside under ".kiro/skills/" and can be stored under Project or Global level. Kiro also supports Agents.md. See Kiro docs at https://kiro.dev/docs/skills/
</details>

<details>
<summary><b>Codex / Other Agents</b></summary>

Skills are plain Markdown - they work with any agent that accepts system prompts or instruction files. For Codex-style skill loading without Antigravity slash aliases, point at `codex/skills/`. See [docs/getting-started.md](docs/getting-started.md).

</details>



---

## Skill Catalog

The commands above are entry points. The pack includes core lifecycle skills plus platform-specific extensions for Apple-platform development. Each skill is a structured workflow with steps, verification gates, and anti-rationalization tables. You can also reference any skill directly.

### Meta - Discover which skill applies

| Skill | What It Does | Use When |
|-------|-------------|----------|
| [using-agent-skills](skills/using-agent-skills/SKILL.md) | Maps incoming work to the right skill workflow and defines shared operating rules | Starting a session or deciding which skill applies |

### Platform Lane Routers

Each router is the single entry point for its lane; its domain skills live under `references/` and are read on demand.

| Router | Lane | References |
|--------|------|------------|
| [swift-best-practices](skills/swift-best-practices/SKILL.md) | 🍎 Apple/Swift | 31 — SwiftUI (patterns, review, performance, Apple-authored guidance), concurrency, SwiftData, testing, UIKit, accessibility, security, simulator/device debugging, Xcode build/signing, App Store Connect release, ASO, macOS packaging, C interop |
| [web-best-practices](skills/web-best-practices/SKILL.md) | 🌐 Frontend | 2 — frontend UI engineering, browser runtime verification via Chrome DevTools |
| [backend-best-practices](skills/backend-best-practices/SKILL.md) | ⚙️ Backend/API | 4 — API contracts, security hardening, observability, CI/CD |
| [react-native-best-practices](skills/react-native-best-practices/SKILL.md) | 📱 React Native | 29 — Callstack performance guide: FPS/re-renders, TTI, bundle size, memory, animations, Turbo Modules |
| [react-native-tv-best-practices](skills/react-native-tv-best-practices/SKILL.md) | 📺 RN TV | focus/D-pad navigation, 10-foot UI, TV playback/DRM for react-native-tvos / Expo TV / Vega |
| [kotlin-best-practices](skills/kotlin-best-practices/SKILL.md) | 🅺 Kotlin/KMP | 5 — JetBrains: Spring/JPA entities in Kotlin, Java→Kotlin conversion, AGP 9 / CocoaPods→SPM / collections migrations |
| [android-best-practices](skills/android-best-practices/SKILL.md) | 🤖 Android | 19 — Google: Jetpack Compose UI, Navigation 3, AGP, Perfetto, R8, intent security, testing, CameraX, Play Billing/Engage, Wear OS, XR |

### Define - Clarify what to build

| Skill | What It Does | Use When |
|-------|-------------|----------|
| [interview-me](skills/interview-me/SKILL.md) | One-question-at-a-time interview that extracts what the user actually wants instead of what they think they should want, until ~95% confidence | The ask is underspecified, or the user invokes "interview me" / "grill me" |
| [idea-refine](skills/idea-refine/SKILL.md) | Structured divergent/convergent thinking to turn vague ideas into concrete proposals | You have a rough concept that needs exploration |
| [spec-driven-development](skills/spec-driven-development/SKILL.md) | Write a PRD covering objectives, commands, structure, code style, testing, and boundaries before any code | Starting a new project, feature, or significant change |

### Plan - Break it down

| Skill | What It Does | Use When |
|-------|-------------|----------|
| [planning-and-task-breakdown](skills/planning-and-task-breakdown/SKILL.md) | Decompose specs into small, verifiable tasks with acceptance criteria and dependency ordering | You have a spec and need implementable units |

### Build - Write the code

| Skill | What It Does | Use When |
|-------|-------------|----------|
| [incremental-implementation](skills/incremental-implementation/SKILL.md) | Thin vertical slices - implement, test, verify, commit. Feature flags, safe defaults, rollback-friendly changes | Any change touching more than one file |
| [test-driven-development](skills/test-driven-development/SKILL.md) | Red-Green-Refactor, test pyramid (80/15/5), test sizes, DAMP over DRY, Beyonce Rule, browser testing | Implementing logic, fixing bugs, or changing behavior |
| [context-engineering](skills/context-engineering/SKILL.md) | Feed agents the right information at the right time - rules files, context packing, MCP integrations | Starting a session, switching tasks, or when output quality drops |
| [source-driven-development](skills/source-driven-development/SKILL.md) | Ground every framework decision in official documentation - verify, cite sources, flag what's unverified | You want authoritative, source-cited code for any framework or library |
| [doubt-driven-development](skills/doubt-driven-development/SKILL.md) | Adversarial fresh-context review of every non-trivial decision in-flight - CLAIM → EXTRACT → DOUBT → RECONCILE → STOP, with optional user-authorized cross-model escalation | Stakes are high (production, security, irreversible), working in unfamiliar code, or a confident output is cheaper to verify now than to debug later |
| [frontend-ui-engineering](skills/web-best-practices/references/frontend-ui-engineering/SKILL.md) | Component architecture, design systems, state management, responsive design, WCAG 2.1 AA accessibility | Building or modifying user-facing interfaces (🌐 lane) |
| [api-and-interface-design](skills/backend-best-practices/references/api-and-interface-design/SKILL.md) | Contract-first design, Hyrum's Law, One-Version Rule, error semantics, boundary validation | Designing APIs, module boundaries, or public interfaces (⚙️ lane) |

### Verify - Prove it works

| Skill | What It Does | Use When |
|-------|-------------|----------|
| [browser-testing-with-devtools](skills/web-best-practices/references/browser-testing-with-devtools/SKILL.md) | Chrome DevTools MCP for live runtime data - DOM inspection, console logs, network traces, performance profiling | Building or debugging anything that runs in a browser (🌐 lane) |
| [debugging-and-error-recovery](skills/debugging-and-error-recovery/SKILL.md) | Five-step triage: reproduce, localize, reduce, fix, guard. Stop-the-line rule, safe fallbacks | Tests fail, builds break, or behavior is unexpected |

### Review - Quality gates before merge

| Skill | What It Does | Use When |
|-------|-------------|----------|
| [code-review-and-quality](skills/code-review-and-quality/SKILL.md) | Five-axis review, change sizing (~100 lines), severity labels (Nit/Optional/FYI), review speed norms, splitting strategies | Before merging any change |
| [code-simplification](skills/code-simplification/SKILL.md) | Chesterton's Fence, Rule of 500, reduce complexity while preserving exact behavior | Code works but is harder to read or maintain than it should be |
| [security-and-hardening](skills/backend-best-practices/references/security-and-hardening/SKILL.md) | OWASP Top 10 prevention, auth patterns, secrets management, dependency auditing, three-tier boundary system | Handling user input, auth, data storage, or external integrations (⚙️ lane) |
| [performance-optimization](skills/performance-optimization/SKILL.md) | Measure-first approach - Core Web Vitals targets, profiling workflows, bundle analysis, anti-pattern detection | Performance requirements exist or you suspect regressions |

### Ship - Deploy with confidence

| Skill | What It Does | Use When |
|-------|-------------|----------|
| [git-workflow-and-versioning](skills/git-workflow-and-versioning/SKILL.md) | Trunk-based development, atomic commits, change sizing (~100 lines), the commit-as-save-point pattern | Making any code change (always) |
| [ci-cd-and-automation](skills/backend-best-practices/references/ci-cd-and-automation/SKILL.md) | Shift Left, Faster is Safer, feature flags, quality gate pipelines, failure feedback loops | Setting up or modifying build and deploy pipelines (⚙️ lane) |
| [deprecation-and-migration](skills/deprecation-and-migration/SKILL.md) | Code-as-liability mindset, compulsory vs advisory deprecation, migration patterns, zombie code removal | Removing old systems, migrating users, or sunsetting features |
| [documentation-and-adrs](skills/documentation-and-adrs/SKILL.md) | Architecture Decision Records, API docs, inline documentation standards - document the *why* | Making architectural decisions, changing APIs, or shipping features |
| [observability-and-instrumentation](skills/backend-best-practices/references/observability-and-instrumentation/SKILL.md) | Structured logging, RED metrics, OpenTelemetry tracing, symptom-based alerting - instrument as you build | Adding telemetry, or shipping anything that runs in production (⚙️ lane) |
| [shipping-and-launch](skills/shipping-and-launch/SKILL.md) | Pre-launch checklists, feature flag lifecycle, staged rollouts, rollback procedures, monitoring setup | Preparing to deploy to production |

---

## Agent Personas

Pre-configured specialist personas for targeted reviews:

| Agent | Role | Perspective |
|-------|------|-------------|
| [code-reviewer](agents/code-reviewer.md) | Senior Staff Engineer | Five-axis code review with "would a staff engineer approve this?" standard |
| [test-engineer](agents/test-engineer.md) | QA Specialist | Test strategy, coverage analysis, and the Prove-It pattern |
| [security-auditor](agents/security-auditor.md) | Security Engineer | Vulnerability detection, threat modeling, OWASP assessment |
| [web-performance-auditor](agents/web-performance-auditor.md) | Web Performance Engineer | Core Web Vitals audit with Quick/Deep modes and a metric-honesty rule; run it via `/webperf` |

See [docs/agents.md](docs/agents.md) for the decision matrix, orchestration rules, and how personas compose with skills and entry points.

---

## Reference Checklists

Quick-reference material that skills pull in when needed:

| Reference | Covers |
|-----------|--------|
| [definition-of-done.md](references/definition-of-done.md) | Project-wide standing bar every change clears, contrasted with per-task acceptance criteria |
| [testing-patterns.md](references/testing-patterns.md) | Test structure, naming, mocking, React/API/E2E examples, anti-patterns |
| [security-checklist.md](references/security-checklist.md) | Pre-commit checks, auth, input validation, headers, CORS, OWASP Top 10 |
| [performance-checklist.md](references/performance-checklist.md) | Core Web Vitals targets, frontend/backend checklists, measurement commands |
| [accessibility-checklist.md](references/accessibility-checklist.md) | Keyboard nav, screen readers, visual design, ARIA, testing tools |
| [observability-checklist.md](references/observability-checklist.md) | On-call questions, structured logging, RED/USE metrics, tracing, symptom-based alerting, pre-launch gate |
| [orchestration-patterns.md](references/orchestration-patterns.md) | Endorsed multi-persona orchestration patterns, anti-patterns, and the "personas don't invoke personas" rule |

---

## How Skills Work

Every skill follows a consistent anatomy:

```
┌─────────────────────────────────────────────────┐
│  SKILL.md                                       │
│                                                 │
│  ┌─ Frontmatter ─────────────────────────────┐  │
│  │ name: lowercase-hyphen-name               │  │
│  │ description: Guides agents through [task].│  │
│  │              Use when…                    │  │
│  └───────────────────────────────────────────┘  │
│  Overview         → What this skill does        │
│  When to Use      → Triggering conditions       │
│  Process          → Step-by-step workflow       │
│  Rationalizations → Excuses + rebuttals         │
│  Red Flags        → Signs something's wrong     │
│  Verification     → Evidence requirements       │
└─────────────────────────────────────────────────┘
```

**Key design choices:**

- **Process, not prose.** Skills are workflows agents follow, not reference docs they read. Each has steps, checkpoints, and exit criteria.
- **Anti-rationalization.** Every skill includes a table of common excuses agents use to skip steps (e.g., "I'll add tests later") with documented counter-arguments.
- **Verification is non-negotiable.** Every skill ends with evidence requirements - tests passing, build output, runtime data. "Seems right" is never sufficient.
- **Progressive disclosure.** The `SKILL.md` is the entry point. Supporting references load only when needed, keeping token usage minimal. Lane routers take this one level further: a whole platform's skill set sits behind one router frontmatter, and each domain skill is read only when its surface comes up.

---

## Project Structure

```
agent-skills/
├── skills/                            # Shared lifecycle skills + lane routers + slash aliases
│   ├── spec-driven-development/       #   Define   (also: interview-me, idea-refine)
│   ├── planning-and-task-breakdown/   #   Plan
│   ├── incremental-implementation/    #   Build    (also: context/source/doubt-driven, TDD)
│   ├── debugging-and-error-recovery/  #   Verify
│   ├── code-review-and-quality/       #   Review   (also: code-simplification, performance)
│   ├── shipping-and-launch/           #   Ship     (also: git-workflow, deprecation, docs)
│   ├── using-agent-skills/            #   Meta: routing + operating rules
│   ├── swift-best-practices/          #   🍎 lane router → references/ (31 Apple skills)
│   ├── web-best-practices/            #   🌐 lane router → references/
│   ├── backend-best-practices/        #   ⚙️ lane router → references/
│   ├── kotlin-best-practices/         #   🅺 lane router → references/ (JetBrains)
│   ├── android-best-practices/        #   🤖 lane router → references/ (Google)
│   ├── react-native-best-practices/   #   📱 Callstack router (flat references/)
│   ├── react-native-tv-best-practices/#   📺 Callstack TV router
│   └── <alias>/SKILL.md               #   Antigravity slash aliases (spec, build, lane-init, …)
├── agents/                            # 4 specialist personas
├── references/                        # Supplementary checklists
├── hooks/                             # Session lifecycle hooks
├── .claude/commands/                  # 9 slash commands (Claude Code)
├── claude/skills/                     # Alias-free full view for Claude plugin installs
├── codex/skills/                      # Alias-free full view for Codex-style installs
├── rules/                             # Antigravity always-on routing rules
├── skills-manifest.json               # Upstream sources for vendored skills
├── plugin.json                        # Antigravity plugin manifest
└── docs/                              # Setup guides per tool + lane-templates/
```

---

## Why Agent Skills?

AI coding agents default to the shortest path - which often means skipping specs, tests, security reviews, and the practices that make software reliable. Agent Skills gives agents structured workflows that enforce the same discipline senior engineers bring to production code.

Each skill encodes hard-won engineering judgment: *when* to write a spec, *what* to test, *how* to review, and *when* to ship. These aren't generic prompts - they're the kind of opinionated, process-driven workflows that separate production-quality work from prototype-quality work.

Skills bake in best practices from Google's engineering culture — including concepts from [Software Engineering at Google](https://abseil.io/resources/swe-book) and Google's [engineering practices guide](https://google.github.io/eng-practices/). You'll find Hyrum's Law in API design, the Beyonce Rule and test pyramid in testing, change sizing and review speed norms in code review, Chesterton's Fence in simplification, trunk-based development in git workflow, Shift Left and feature flags in CI/CD, and a dedicated deprecation skill treating code as a liability. These aren't abstract principles — they're embedded directly into the step-by-step workflows agents follow.

---

## How it compares

Wondering how this stacks up against [Superpowers](https://github.com/obra/superpowers) or [Matt Pocock's skills](https://github.com/mattpocock/skills)? See **[docs/comparison.md](docs/comparison.md)** for an honest, side-by-side look at how the three are shaped differently and when to reach for each — including a link to a controlled [head-to-head experiment](https://www.linkedin.com/pulse/superpowers-vs-agent-skills-faster-shipping-safer-reasoning-om-mishra-dzakf/).

---

## Contributing

Skills should be **specific** (actionable steps, not vague advice), **verifiable** (clear exit criteria with evidence requirements), **battle-tested** (based on real workflows), and **minimal** (only what's needed to guide the agent).

See [docs/skill-anatomy.md](docs/skill-anatomy.md) for the format specification and [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT - use these skills in your projects, teams, and tools.
