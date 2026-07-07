---
name: ci-cd-and-automation
description: Automates CI/CD pipeline setup for web (Node/TypeScript) and Apple (Swift/Xcode) projects. Use when setting up or modifying build and deployment pipelines. Use when you need to automate quality gates, configure test runners in CI, establish deployment strategies, or ship to TestFlight / App Store.
---

# CI/CD and Automation

## Overview

Automate quality gates so that no change reaches production without passing tests, lint, type checking, and build. CI/CD is the enforcement mechanism for every other skill — it catches what humans and agents miss, and it does so consistently on every single change.

**Shift Left:** Catch problems as early in the pipeline as possible. A bug caught in linting costs minutes; the same bug caught in production costs hours. Move checks upstream — static analysis before tests, tests before staging, staging before production.

**Faster is Safer:** Smaller batches and more frequent releases reduce risk, not increase it. A deployment with 3 changes is easier to debug than one with 30. Frequent releases build confidence in the release process itself.

## When to Use

- Setting up a new project's CI pipeline
- Adding or modifying automated checks
- Configuring deployment pipelines
- When a change should trigger automated verification
- Debugging CI failures
- Setting up Xcode Cloud or GitHub Actions for iOS/macOS projects
- Automating TestFlight distribution or App Store submission

## The Quality Gate Pipeline

Every change goes through these gates before merge:

### Web (Node/TypeScript)

```
Pull Request Opened
    │
    ▼
┌─────────────────┐
│   LINT CHECK     │  eslint, prettier
│   ↓ pass         │
│   TYPE CHECK     │  tsc --noEmit
│   ↓ pass         │
│   UNIT TESTS     │  jest/vitest
│   ↓ pass         │
│   BUILD          │  npm run build
│   ↓ pass         │
│   INTEGRATION    │  API/DB tests
│   ↓ pass         │
│   E2E (optional) │  Playwright/Cypress
│   ↓ pass         │
│   SECURITY AUDIT │  npm audit
│   ↓ pass         │
│   BUNDLE SIZE    │  bundlesize check
└─────────────────┘
    │
    ▼
  Ready for review
```

### Apple (Swift/Xcode)

```
Pull Request Opened
    │
    ▼
┌─────────────────────┐
│   LINT CHECK         │  SwiftLint / SwiftFormat
│   ↓ pass             │
│   COMPILE            │  swift build / xcodebuild build
│   ↓ pass             │
│   UNIT TESTS         │  swift test / xcodebuild test
│   ↓ pass             │
│   UI TESTS           │  XCUITest (Simulator)
│   ↓ pass             │
│   STATIC ANALYSIS    │  Xcode Analyzer / periphery (dead code)
│   ↓ pass             │
│   ARCHIVE            │  xcodebuild archive
└─────────────────────┘
    │
    ▼
  Ready for review
```

**No gate can be skipped.** If lint fails, fix lint — don't disable the rule. If a test fails, fix the code — don't skip the test.

## GitHub Actions Configuration

### Web: Basic CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm test -- --coverage

      - name: Build
        run: npm run build

      - name: Security audit
        run: npm audit --audit-level=high
```

### Apple: Basic CI Pipeline

```yaml
# .github/workflows/ci-apple.yml
name: Apple CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: macos-latest
    env:
      SCHEME: MyApp
      DESTINATION: 'platform=iOS Simulator,name=iPhone 16,OS=latest'
    steps:
      - uses: actions/checkout@v4

      - name: Select Xcode
        run: sudo xcode-select -s /Applications/Xcode_16.app

      - name: Cache DerivedData
        uses: actions/cache@v4
        with:
          path: ~/Library/Developer/Xcode/DerivedData
          key: deriveddata-${{ runner.os }}-${{ hashFiles('**/*.swift', '**/Package.resolved', '**/*.pbxproj') }}
          restore-keys: deriveddata-${{ runner.os }}-

      - name: SwiftLint
        run: |
          brew install swiftlint
          swiftlint lint --strict --reporter github-actions-logging

      - name: Build
        run: |
          xcodebuild build \
            -scheme "$SCHEME" \
            -destination "$DESTINATION" \
            -skipPackagePluginValidation \
            CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO | xcpretty

      - name: Unit Tests
        run: |
          xcodebuild test \
            -scheme "$SCHEME" \
            -destination "$DESTINATION" \
            -resultBundlePath TestResults.xcresult | xcpretty

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-results
          path: TestResults.xcresult
```

### Apple: Swift Package CI (no Xcode project)

```yaml
  swift-package:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4

      - name: Select Xcode
        run: sudo xcode-select -s /Applications/Xcode_16.app

      - name: Resolve dependencies
        run: swift package resolve

      - name: Build
        run: swift build -Xswiftc -warnings-as-errors

      - name: Test
        run: swift test --parallel

      - name: SwiftLint
        run: |
          brew install swiftlint
          swiftlint lint --strict
```

### Web: With Database Integration Tests

```yaml
  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: ci_user
          POSTGRES_PASSWORD: ${{ secrets.CI_DB_PASSWORD }}
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://ci_user:${{ secrets.CI_DB_PASSWORD }}@localhost:5432/testdb
      - name: Integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://ci_user:${{ secrets.CI_DB_PASSWORD }}@localhost:5432/testdb
```

> **Note:** Even for CI-only test databases, use GitHub Secrets for credentials rather than hardcoding values. This builds good habits and prevents accidental reuse of test credentials in other contexts.

### Apple: XCUITest (UI Tests)

```yaml
  ui-tests:
    runs-on: macos-latest
    env:
      SCHEME: MyApp
      DESTINATION: 'platform=iOS Simulator,name=iPhone 16,OS=latest'
    steps:
      - uses: actions/checkout@v4
      - name: Select Xcode
        run: sudo xcode-select -s /Applications/Xcode_16.app
      - name: Boot simulator
        run: |
          xcrun simctl boot "iPhone 16" || true
      - name: Run UI tests
        run: |
          xcodebuild test \
            -scheme "$SCHEME" \
            -destination "$DESTINATION" \
            -testPlan UITests \
            -resultBundlePath UITestResults.xcresult | xcpretty
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: ui-test-results
          path: UITestResults.xcresult
```

### Web: E2E Tests

```yaml
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      - name: Build
        run: npm run build
      - name: Run E2E tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Feeding CI Failures Back to Agents

The power of CI with AI agents is the feedback loop. When CI fails:

```
CI fails
    │
    ▼
Copy the failure output
    │
    ▼
Feed it to the agent:
"The CI pipeline failed with this error:
[paste specific error]
Fix the issue and verify locally before pushing again."
    │
    ▼
Agent fixes → pushes → CI runs again
```

### Web (Node/TypeScript)

```
Lint failure → Agent runs `npm run lint --fix` and commits
Type error  → Agent reads the error location and fixes the type
Test failure → Agent follows debugging-and-error-recovery skill
Build error → Agent checks config and dependencies
```

### Apple (Swift/Xcode)

```
SwiftLint failure  → Agent runs `swiftlint --fix` and commits
Compiler error     → Agent reads the error location, fixes Swift code
                     (check for missing imports, type mismatches, API changes)
Test failure       → Agent runs `swift test --filter <FailingTest>` locally,
                     follows debugging-and-error-recovery skill
Archive failure    → Agent checks signing, provisioning profiles, build settings
Simulator failure  → Agent resets simulator: `xcrun simctl erase all`
```

## Deployment Strategies

### Web: Preview Deployments

Every PR gets a preview deployment for manual testing:

```yaml
# Deploy preview on PR (Vercel/Netlify/etc.)
deploy-preview:
  runs-on: ubuntu-latest
  if: github.event_name == 'pull_request'
  steps:
    - uses: actions/checkout@v4
    - name: Deploy preview
      run: npx vercel --token=${{ secrets.VERCEL_TOKEN }}
```

### Apple: TestFlight Distribution

Every merge to main pushes a build to TestFlight for internal testing:

```yaml
# Deploy to TestFlight on merge
deploy-testflight:
  runs-on: macos-latest
  if: github.ref == 'refs/heads/main'
  needs: [quality]
  steps:
    - uses: actions/checkout@v4

    - name: Select Xcode
      run: sudo xcode-select -s /Applications/Xcode_16.app

    - name: Install Fastlane
      run: gem install fastlane

    - name: Build and upload to TestFlight
      env:
        APP_STORE_CONNECT_API_KEY_ID: ${{ secrets.ASC_KEY_ID }}
        APP_STORE_CONNECT_API_ISSUER_ID: ${{ secrets.ASC_ISSUER_ID }}
        APP_STORE_CONNECT_API_KEY: ${{ secrets.ASC_PRIVATE_KEY }}
        MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
      run: |
        fastlane beta
```

### Apple: Xcode Cloud

Xcode Cloud is Apple's first-party CI/CD. Use it when:
- You want zero runner maintenance
- The project is primarily Xcode-native (no complex scripting)
- You need Apple Silicon builds without self-hosted runners

Configure via **Xcode → Product → Xcode Cloud → Create Workflow**:

```
Xcode Cloud Workflow
├── Start Condition: PR or push to main
├── Build Action: archive for iOS
├── Test Action: run unit + UI tests
├── Post-Action: distribute to TestFlight (internal group)
└── Notifications: Slack webhook on failure
```

> **Note:** Xcode Cloud has limited customization compared to GitHub Actions. Use GitHub Actions for complex pipelines; use Xcode Cloud for straightforward build-test-distribute flows.

### Apple: Phased Release

App Store phased releases reduce risk by rolling out to percentages of users:

```
Build submitted to App Store Connect
    │
    ▼
  App Review approval
    │
    ▼
  Phased Release enabled (7-day rollout)
    Day 1:  1%  │  Day 2:  2%  │  Day 3:  5%
    Day 4: 10%  │  Day 5: 20%  │  Day 6: 50%
    Day 7: 100%
    │
    ├── Crash rate spikes → Pause release in App Store Connect
    └── Clean → Complete
```

### Apple: Fastlane Automation

Fastlane automates the most painful parts of iOS deployment:

```ruby
# fastlane/Fastfile
default_platform(:ios)

platform :ios do
  desc "Run tests"
  lane :test do
    run_tests(
      scheme: "MyApp",
      devices: ["iPhone 16"],
      clean: true,
      result_bundle: true
    )
  end

  desc "Build and push to TestFlight"
  lane :beta do
    increment_build_number
    match(type: "appstore")
    build_app(scheme: "MyApp")
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end

  desc "Submit to App Store"
  lane :release do
    build_app(scheme: "MyApp")
    upload_to_app_store(
      submit_for_review: true,
      automatic_release: false,
      phased_release: true
    )
  end
end
```

### Feature Flags

Feature flags decouple deployment from release. Deploy incomplete or risky features behind flags so you can:

- **Ship code without enabling it.** Merge to main early, enable when ready.
- **Roll back without redeploying.** Disable the flag instead of reverting code.
- **Canary new features.** Enable for 1% of users, then 10%, then 100%.
- **Run A/B tests.** Compare behavior with and without the feature.

```typescript
// Simple feature flag pattern (Web)
if (featureFlags.isEnabled('new-checkout-flow', { userId })) {
  return renderNewCheckout();
}
return renderLegacyCheckout();
```

```swift
// Simple feature flag pattern (Apple — Firebase Remote Config)
let newCheckout = RemoteConfig.remoteConfig().configValue(forKey: "new_checkout_flow").boolValue
if newCheckout {
    showNewCheckout()
} else {
    showLegacyCheckout()
}
```

**Flag lifecycle:** Create → Enable for testing → Canary → Full rollout → Remove the flag and dead code. Flags that live forever become technical debt — set a cleanup date when you create them.

### Staged Rollouts

```
PR merged to main
    │
    ▼
  Staging deployment (auto)
    │ Manual verification
    ▼
  Production deployment (manual trigger or auto after staging)
    │
    ▼
  Monitor for errors (15-minute window)
    │
    ├── Errors detected → Rollback
    └── Clean → Done
```

### Rollback Plan

Every deployment should be reversible:

#### Web

```yaml
# Manual rollback workflow
name: Rollback
on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - name: Rollback deployment
        run: |
          # Deploy the specified previous version
          npx vercel rollback ${{ inputs.version }}
```

#### Apple

For App Store releases, rollback is limited — you cannot pull a live version. Mitigation strategies:

- **Kill switch via Remote Config:** Disable broken features instantly without a new binary.
- **Expedited review:** Submit a hotfix and request an expedited App Store review.
- **Phased release pause:** If using phased release, pause the rollout immediately in App Store Connect.
- **TestFlight regression test:** Always verify the fix on TestFlight before resubmitting.

## Environment Management

```
.env.example       → Committed (template for developers)
.env                → NOT committed (local development)
.env.test           → Committed (test environment, no real secrets)
CI secrets          → Stored in GitHub Secrets / vault
Production secrets  → Stored in deployment platform / vault
```

For Apple projects, additionally:

```
Certificates/Profiles → Managed via Fastlane Match (encrypted Git repo) or Xcode automatic signing
API keys              → Stored in GitHub Secrets, injected via xcconfig or build phase script
.xcconfig files       → Committed (no secrets), reference $(SECRET_NAME) from environment
```

CI should never have production secrets. Use separate secrets for CI testing.

## Automation Beyond CI

### Dependabot / Renovate

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 5

  - package-ecosystem: swift
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 3
```

### Build Cop Role

Designate someone responsible for keeping CI green. When the build breaks, the Build Cop's job is to fix or revert — not the person whose change caused the break. This prevents broken builds from accumulating while everyone assumes someone else will fix it.

### PR Checks

- **Required reviews:** At least 1 approval before merge
- **Required status checks:** CI must pass before merge
- **Branch protection:** No force-pushes to main
- **Auto-merge:** If all checks pass and approved, merge automatically

## CI Optimization

When the pipeline exceeds 10 minutes, apply these strategies in order of impact:

### Web (Node/TypeScript)

```
Slow CI pipeline?
├── Cache dependencies
│   └── Use actions/cache or setup-node cache option for node_modules
├── Run jobs in parallel
│   └── Split lint, typecheck, test, build into separate parallel jobs
├── Only run what changed
│   └── Use path filters to skip unrelated jobs (e.g., skip e2e for docs-only PRs)
├── Use matrix builds
│   └── Shard test suites across multiple runners
├── Optimize the test suite
│   └── Remove slow tests from the critical path, run them on a schedule instead
└── Use larger runners
    └── GitHub-hosted larger runners or self-hosted for CPU-heavy builds
```

### Apple (Swift/Xcode)

```
Slow CI pipeline?
├── Cache DerivedData
│   └── Use actions/cache with ~/Library/Developer/Xcode/DerivedData
│       Key on *.swift, Package.resolved, *.pbxproj hashes
├── Cache Swift Package Manager
│   └── Cache ~/Library/Developer/Xcode/DerivedData/SourcePackages
├── Run tests in parallel
│   └── xcodebuild test -parallel-testing-enabled YES
│       -maximum-parallel-testing-workers 4
├── Split unit and UI tests
│   └── Run unit tests and UI tests as separate parallel jobs
│       UI tests are slower; don't block the fast feedback loop
├── Use test plans
│   └── Separate test plans for smoke (fast) vs. full (slow) suites
│       Run smoke on every PR, full on nightly
├── Skip code signing in CI
│   └── CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
│       Only sign when archiving for distribution
└── Use Apple Silicon runners
    └── M-series runners build Swift 2-4x faster than Intel
        GitHub macos-latest uses M-series; self-host for more control
```

**Example: Web caching and parallelism**

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm test -- --coverage
```

**Example: Apple caching and parallel testing**

```yaml
jobs:
  swift-lint:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - run: brew install swiftlint
      - run: swiftlint lint --strict

  unit-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - name: Cache DerivedData
        uses: actions/cache@v4
        with:
          path: ~/Library/Developer/Xcode/DerivedData
          key: deriveddata-${{ runner.os }}-${{ hashFiles('**/*.swift', '**/Package.resolved') }}
          restore-keys: deriveddata-${{ runner.os }}-
      - run: |
          xcodebuild test \
            -scheme MyApp \
            -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest' \
            -parallel-testing-enabled YES \
            CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO | xcpretty

  ui-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - name: Cache DerivedData
        uses: actions/cache@v4
        with:
          path: ~/Library/Developer/Xcode/DerivedData
          key: deriveddata-${{ runner.os }}-${{ hashFiles('**/*.swift', '**/Package.resolved') }}
          restore-keys: deriveddata-${{ runner.os }}-
      - run: |
          xcodebuild test \
            -scheme MyApp \
            -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest' \
            -testPlan UITests | xcpretty
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "CI is too slow" | Optimize the pipeline (see CI Optimization below), don't skip it. A 5-minute pipeline prevents hours of debugging. |
| "This change is trivial, skip CI" | Trivial changes break builds. CI is fast for trivial changes anyway. |
| "The test is flaky, just re-run" | Flaky tests mask real bugs and waste everyone's time. Fix the flakiness. |
| "We'll add CI later" | Projects without CI accumulate broken states. Set it up on day one. |
| "Manual testing is enough" | Manual testing doesn't scale and isn't repeatable. Automate what you can. |
| "macOS runners are too expensive" | Cache DerivedData aggressively and split jobs. A 10-min Apple CI run prevents App Store rejections. |
| "Xcode Cloud handles it" | Xcode Cloud is limited — no custom scripts, no matrix builds. Use GitHub Actions for complex pipelines. |
| "We'll test on device later" | Simulator CI catches 90% of issues. Don't wait for device testing to find compile errors. |

## Red Flags

- No CI pipeline in the project
- CI failures ignored or silenced
- Tests disabled in CI to make the pipeline pass
- Production deploys without staging verification
- No rollback mechanism
- Secrets stored in code or CI config files (not secrets manager)
- Long CI times with no optimization effort
- App Store submission without TestFlight testing
- No DerivedData caching on macOS runners (CI takes 30+ minutes)
- Code signing done manually instead of via Match or Xcode automatic signing
- XCUITest skipped because "it's slow" — split into smoke and full suites instead
- No phased release strategy for App Store deployments
- Provisioning profiles managed by hand instead of automated tooling

## Verification

After setting up or modifying CI:

- [ ] All quality gates are present (lint, types/compile, tests, build, audit/archive)
- [ ] Pipeline runs on every PR and push to main
- [ ] Failures block merge (branch protection configured)
- [ ] CI results feed back into the development loop
- [ ] Secrets are stored in the secrets manager, not in code
- [ ] Deployment has a rollback mechanism
- [ ] Pipeline runs in under 10 minutes for the test suite

### Apple-specific verification

- [ ] SwiftLint runs in strict mode on every PR
- [ ] Both unit tests and UI tests run in CI
- [ ] DerivedData is cached between runs
- [ ] Code signing is automated (Match or Xcode automatic signing)
- [ ] TestFlight builds deploy automatically on merge to main
- [ ] Phased release or kill switch is configured for production
- [ ] Provisioning profiles are not committed to the repo
- [ ] xcpretty or xcbeautify is used for readable CI output
