---
name: ship
description: Run the pre-launch checklist and produce a go/no-go decision. Use when preparing a production-bound change for release.
---

# Ship

Follow `shipping-and-launch`.

Classify the release platform as web, Apple platform, or shared backend/library. Run or simulate the flat fan-out review with `code-reviewer`, `security-auditor`, and `test-engineer`, then merge their reports into one go/no-go decision.

In the merge phase, check quality, security, performance, accessibility, infrastructure, documentation, runtime verification, and rollback plan. Web uses `browser-testing-with-devtools`; Apple platforms use `ios-debugger-agent`, `device-interaction`, Xcode build/test commands, or App Store Connect skills when release flow is involved.
