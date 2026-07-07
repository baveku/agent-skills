---
name: backend-best-practices
description: Provides backend/API engineering guidelines for interface contracts, security hardening, observability, and CI/CD pipelines. Use when any task touches the ⚙️ Backend/API lane — designing REST/GraphQL/RPC endpoints or module boundaries, handling untrusted input or auth, adding logging/metrics/tracing, or building deployment pipelines.
metadata:
  tags: backend, api, security, observability, ci-cd, rest, graphql
---

# Backend Best Practices

## Overview

Routing hub for the ⚙️ Backend/API lane. Backend domain skills live under [references/][references] and are read on demand. Detect the lane per `rules/skill-routing.md`, land here, open the reference your task needs.

There is no dedicated persistence/messaging reference yet — for DB, queue, or cache work use `source-driven-development` against the official docs plus project-local commands.

## When to Use

- Designing or changing API endpoints, contracts, or module boundaries.
- Any path handling untrusted input, authentication, authorization, or secrets.
- Making production behavior observable: logging, metrics, tracing, alerting.
- Building or modifying CI/CD pipelines and quality gates.

## Quick Reference

### Workflow

**Classify surface → Read the matching reference → Follow its workflow → Verify with integration/smoke tests**

1. **Classify** the task with Problem → Reference Mapping below.
2. **Read** the reference's `SKILL.md` fully.
3. **Follow** its process; combine with one Shared-bucket lifecycle skill per `rules/skill-routing.md`.
4. **Verify** with the project's integration/smoke-test commands — backend has no visual surface to eyeball.

### Review Guardrails

- Every endpoint accepting untrusted input gets [security-and-hardening][security-and-hardening] applied — no exceptions for "internal" services.
- Contract changes are breaking changes until proven otherwise — check consumers before renaming/removing fields.
- A feature without logs/metrics is not done; production behavior must be diagnosable ([observability-and-instrumentation][observability-and-instrumentation]).

## References

| Reference | Impact | Description |
|-----------|--------|-------------|
| [api-and-interface-design][api-and-interface-design] | HIGH | Stable API and interface contracts, module boundaries, versioning |
| [security-and-hardening][security-and-hardening] | CRITICAL | Untrusted input, authn/authz, secrets, injection, session handling |
| [observability-and-instrumentation][observability-and-instrumentation] | HIGH | Logging, metrics, tracing, alerting — making production diagnosable |
| [ci-cd-and-automation][ci-cd-and-automation] | MEDIUM | Pipelines, quality gates, test runners, deployment strategies |

## Problem → Reference Mapping

| Problem | Start With |
|---------|------------|
| New endpoint or API redesign | [api-and-interface-design][api-and-interface-design] → [security-and-hardening][security-and-hardening] |
| Auth, sessions, secrets, user input | [security-and-hardening][security-and-hardening] |
| "What happened in prod?" is unanswerable | [observability-and-instrumentation][observability-and-instrumentation] |
| Flaky or missing pipeline | [ci-cd-and-automation][ci-cd-and-automation] |
| Slow queries / server latency | `performance-optimization` (shared) with profiling evidence |
| DB schema, queues, caches | `source-driven-development` + official docs (no dedicated reference yet) |

## Common Rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "It's an internal service, skip security review." | Internal services get breached through the same input paths. Untrusted input is untrusted everywhere. |
| "We'll add logging later." | Later never comes until the 3am incident. Instrument as you build. |
| "The contract change is small." | Small for you, breaking for consumers. Verify usage before changing shape. |

## Red Flags

- An input-handling path shipped without a security pass.
- Endpoints with no logs or metrics.
- Contract changes merged without checking consumers.

## Verification

- The reference matching the task's surface was read before implementation.
- Integration/smoke tests pass; security-relevant paths got a hardening review.
- The reference's own Verification section is satisfied.

[references]: references/
[api-and-interface-design]: references/api-and-interface-design/SKILL.md
[security-and-hardening]: references/security-and-hardening/SKILL.md
[observability-and-instrumentation]: references/observability-and-instrumentation/SKILL.md
[ci-cd-and-automation]: references/ci-cd-and-automation/SKILL.md
