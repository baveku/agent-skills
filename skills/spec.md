---
name: spec
description: Start spec-driven development before writing code. Use when defining a new project, feature, or significant change.
---

# Spec

Follow `spec-driven-development`.

Classify the target platform as web, Apple platform, or shared backend/library. For Apple work, capture the app target, OS deployment range, SwiftUI/UIKit/AppKit split, persistence model, signing constraints, and simulator/device verification path.

Ask clarifying questions about objective, users, acceptance criteria, stack constraints, and boundaries. Then create `SPEC.md` with objective, commands, project structure, code style, testing strategy, boundaries, success criteria, and open questions.

For Apple-platform specs, include exact `xcodebuild` or SwiftPM commands, test target names, simulator destination, and any App Store/TestFlight constraints that affect implementation.
