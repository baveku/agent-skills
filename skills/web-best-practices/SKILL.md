---
name: web-best-practices
description: Provides web frontend engineering guidelines for UI components, state management, layout, browser runtime verification, and Core Web Vitals. Use when any task touches the 🌐 Frontend lane — building or reviewing browser-rendered UI (React/Vue/Svelte/Next/Vite), verifying behavior in a real browser via DevTools, or diagnosing web performance.
metadata:
  tags: web, frontend, react, vue, svelte, browser, devtools, core-web-vitals
---

# Web Best Practices

## Overview

Routing hub for the 🌐 Frontend lane. Web domain skills live under [references/][references] and are read on demand. Detect the lane per `rules/skill-routing.md`, land here, open the reference your task needs.

## When to Use

- Building or modifying browser-rendered UI: components, layouts, state, styling.
- Verifying web behavior at runtime: DOM, console, network, visual output.
- Web performance work — for a full Core Web Vitals audit, prefer the `/webperf` command (web-performance-auditor persona); use [references][references] here for structural guidance.

## Quick Reference

### Workflow

**Classify surface → Read the matching reference → Follow its workflow → Verify in a real browser**

1. **Classify** the task with Problem → Reference Mapping below.
2. **Read** the reference's `SKILL.md` fully.
3. **Follow** its process; combine with one Shared-bucket lifecycle skill per `rules/skill-routing.md`.
4. **Verify** rendered changes with [browser-testing-with-devtools][browser-testing-with-devtools] — not by assumption.

### Review Guardrails

- Do not declare UI work done without runtime verification in a browser.
- Do not recommend performance changes without evidence (Lighthouse/CrUX/trace) — route audits through `/webperf`.
- Accessibility (keyboard nav, contrast, screen readers) is part of UI work, not an optional extra — [frontend-ui-engineering][frontend-ui-engineering] covers it.

## References

| Reference | Impact | Description |
|-----------|--------|-------------|
| [frontend-ui-engineering][frontend-ui-engineering] | HIGH | Production-quality UI: components, layout, state, styling, accessibility |
| [browser-testing-with-devtools][browser-testing-with-devtools] | HIGH | Real-browser verification via Chrome DevTools MCP: DOM, console, network, performance traces |

## Problem → Reference Mapping

| Problem | Start With |
|---------|------------|
| Build or restyle a component/page | [frontend-ui-engineering][frontend-ui-engineering] |
| State management or data flow in UI | [frontend-ui-engineering][frontend-ui-engineering] |
| Verify a UI change actually works | [browser-testing-with-devtools][browser-testing-with-devtools] |
| Console errors / failing network calls | [browser-testing-with-devtools][browser-testing-with-devtools] |
| Slow page / poor Core Web Vitals | `/webperf` command → [browser-testing-with-devtools][browser-testing-with-devtools] for traces |
| API contract with the backend | cross-lane: `backend-best-practices` → api-and-interface-design |

## Common Rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "The code compiles, the UI is fine." | Rendered output, console, and network behavior are only observable in a browser. Verify there. |
| "Performance looks OK on my machine." | Evidence beats impressions — run `/webperf` with real artifacts before claiming improvements. |

## Red Flags

- Shipping UI changes with zero browser verification.
- Performance claims with no Lighthouse/CrUX/trace evidence.
- Reinventing accessibility late instead of building it into the component.

## Verification

- The reference matching the task's surface was read before implementation.
- Rendered changes were verified in a real browser.
- The reference's own Verification section is satisfied.

[references]: references/
[frontend-ui-engineering]: references/frontend-ui-engineering/SKILL.md
[browser-testing-with-devtools]: references/browser-testing-with-devtools/SKILL.md
