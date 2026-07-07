---
description: Start spec-driven development — write a structured specification before writing code
---

Invoke the agent-skills:spec-driven-development skill.

Begin by understanding what the user wants to build. First detect the project lane — 🍎 Apple/Swift · 🌐 Frontend · ⚙️ Backend/API — using the Project Detection table in `rules/skill-routing.md`, then capture lane-specific constraints:

- **🍎 Apple/Swift** — app target, OS deployment range, SwiftUI/UIKit/AppKit split, persistence model, signing constraints, and simulator/device verification path.
- **🌐 Frontend** — framework, rendering model (SPA/SSR/SSG), browser/target support, and the runtime-verification path (Chrome DevTools).
- **⚙️ Backend/API** — API contract style (REST/GraphQL/RPC), persistence and messaging, auth/authz model, and deployment/runtime target.

Ask clarifying questions about:
1. The objective and target users
2. Core features and acceptance criteria
3. Tech stack preferences and constraints
4. Known boundaries (what to always do, ask first about, and never do)

Then generate a structured spec covering all six core areas: objective, commands, project structure, code style, testing strategy, and boundaries. For 🍎 Apple specs, include exact `xcodebuild` or SwiftPM commands, test target names, simulator destination, and any App Store/TestFlight constraints. For ⚙️ Backend specs, include the API contract, migration/rollback commands, and auth boundaries. Record the detected lane in the spec so `/plan` and `/build` stay in the same lane.

Save the spec as SPEC.md in the project root and confirm with the user before proceeding.
