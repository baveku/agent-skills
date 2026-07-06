# Getting Started with agent-skills

agent-skills works with any AI coding agent that accepts Markdown instructions. This guide covers the universal approach. For tool-specific setup, see the dedicated guides.

## How Skills Work

Each skill is a Markdown file (`SKILL.md`) that describes a specific engineering workflow. When loaded into an agent's context, the agent follows the workflow — including verification steps, anti-patterns to avoid, and exit criteria.

**Skills are not reference docs.** They're step-by-step processes the agent follows.

## Quick Start (Any Agent)

### 1. Clone the repository

```bash
git clone https://github.com/baveku/agent-skills.git
```

### 2. Choose a skill

Browse the `skills/` directory. Each subdirectory contains a `SKILL.md` with:
- **When to use** — triggers that indicate this skill applies
- **Process** — step-by-step workflow
- **Verification** — how to confirm the work is done
- **Common rationalizations** — excuses the agent might use to skip steps
- **Red flags** — signs the skill is being violated

For platform-aware work, classify the task before choosing a skill:

1. Lifecycle: define, plan, build, verify, review, ship.
2. Platform: web, Apple platform, or shared backend/library.
3. Surface: UI, API, persistence, native bridge, runtime verification, performance, security, accessibility, release.

### 3. Load the skill into your agent

Copy the relevant `SKILL.md` content into your agent's system prompt, rules file, or conversation. The most common approaches:

**System prompt:** Paste the skill content at the start of the session.

**Rules file:** Add skill content to your project's rules file (CLAUDE.md, .cursorrules, etc.).

**Conversation:** Reference the skill when giving instructions: "Follow the test-driven-development process for this change."

### 4. Use the meta-skill for discovery

Start with the `using-agent-skills` skill loaded. It contains the lifecycle/platform/surface routing rules that map task types to the appropriate skill.

## Recommended Setup

### Minimal (Start here)

Load three essential skills into your rules file:

1. **spec-driven-development** — For defining what to build
2. **test-driven-development** — For proving it works
3. **code-review-and-quality** — For verifying quality before merge

These three cover the most critical quality gaps in AI-assisted development.

### Full Lifecycle

For comprehensive coverage, load skills by phase:

```
Starting a project:  spec-driven-development → planning-and-task-breakdown
During development:  incremental-implementation + test-driven-development
Before merge:        code-review-and-quality + security-and-hardening
Before deploy:       shipping-and-launch
```

### Context-Aware Loading

Don't load all skills at once — it wastes context. Load skills relevant to the current task:

- Working on web UI? Load `frontend-ui-engineering`
- Working on SwiftUI? Load `swiftui-ui-patterns`, `swiftui-view-refactor`, or `swiftui-pro`
- Verifying browser behavior? Load `browser-testing-with-devtools`
- Verifying iOS behavior? Load `ios-debugger-agent` or `device-interaction`
- Debugging? Load `debugging-and-error-recovery`
- Setting up CI? Load `ci-cd-and-automation`

## Skill Anatomy

Every skill follows the same structure:

```
YAML frontmatter (name, description)
├── Overview — What this skill does
├── When to Use — Triggers and conditions
├── Core Process — Step-by-step workflow
├── Examples — Code samples and patterns
├── Common Rationalizations — Excuses and rebuttals
├── Red Flags — Signs the skill is being violated
└── Verification — Exit criteria checklist
```

See [skill-anatomy.md](skill-anatomy.md) for the full specification.

## Using Agents

The `agents/` directory contains pre-configured agent personas:

| Agent | Purpose |
|-------|---------|
| `code-reviewer.md` | Five-axis code review |
| `test-engineer.md` | Test strategy and writing |
| `security-auditor.md` | Vulnerability detection |
| `web-performance-auditor.md` | Core Web Vitals & performance audit for web apps |

Load an agent definition when you need specialized review. For example, ask your coding agent to "review this change using the code-reviewer agent persona" and provide the agent definition.

## Using Commands

The `.claude/commands/` directory contains slash commands for Claude Code and other harnesses that support command files. Commands are convenience wrappers, not the only way to use the workflows.

| Command | Skill Invoked |
|---------|---------------|
| `/spec` | spec-driven-development |
| `/plan` | planning-and-task-breakdown |
| `/build` | incremental-implementation + test-driven-development |
| `/build auto` | planning-and-task-breakdown → incremental-implementation + test-driven-development (whole plan, one approval) |
| `/test` | test-driven-development |
| `/review` | code-review-and-quality |
| `/code-simplify` | code-simplification |
| `/ship` | shipping-and-launch |
| `/webperf` | web-performance-auditor (specialist agent, web apps only) |

### Commandless equivalents

If your agent platform does not support slash commands, use natural language. `AGENTS.md` and `using-agent-skills` provide the routing rules.

| Instead of | Say |
|------------|-----|
| `/spec` | "Define this feature with a spec first." |
| `/plan` | "Break this spec into small verifiable tasks." |
| `/build` | "Build the next slice using the repo workflow." |
| `/test` | "Write the failing test first, then make it pass." |
| `/review` | "Review this change across correctness, architecture, security, and performance." |
| `/ship` | "Ship-check this production change with rollback planning." |
| `/webperf` | "Audit this web page's Core Web Vitals." |

> **Note:** When installed as a Claude Code plugin you may see a warning like
> _"Default commands/ folder is ignored because the manifest sets 'commands'"_.
> This is expected. The root `commands/` directory belongs to the Antigravity CLI
> and is intentionally separate from `.claude/commands/`. All Claude Code slash
> commands load correctly from `.claude/commands/`; the warning is cosmetic.

## Using References

The `references/` directory contains supplementary checklists:

| Reference | Use With |
|-----------|----------|
| `testing-patterns.md` | test-driven-development |
| `performance-checklist.md` | performance-optimization |
| `security-checklist.md` | security-and-hardening |
| `accessibility-checklist.md` | frontend-ui-engineering |

Load a reference when you need detailed patterns beyond what the skill covers.

## Spec and task artifacts

The spec and planning workflows create working artifacts (`SPEC.md`, `tasks/plan.md`, `tasks/todo.md`) whether they were started by slash command or natural language. Treat them as **living documents** while the work is in progress:

- Keep them in version control during development so the human and the agent have a shared source of truth.
- Update them when scope or decisions change.
- If your repo doesn’t want these files long‑term, delete them before merge or add the folder to `.gitignore` — the workflow doesn’t require them to be permanent.

## Tips

1. **Start with spec-driven-development** for any non-trivial work
2. **Always load test-driven-development** when writing code
3. **Don't skip verification steps** — they're the whole point
4. **Load skills selectively** — more context isn't always better
5. **Use the agents for review** — different perspectives catch different issues
