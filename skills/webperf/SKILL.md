---
name: webperf
description: Audit browser-facing web performance. Use when reviewing Core Web Vitals, Lighthouse reports, DevTools traces, or browser runtime performance.
---

# Webperf

## Overview

Antigravity alias for web performance review. Use the web-performance-auditor agent persona.

## When to Use

- The user invokes `/webperf`.
- A browser-rendered page, SPA, SSR/SSG app, or webview needs performance review.
- Lighthouse, PageSpeed Insights, CrUX, or DevTools trace evidence is available.

## Process

1. Confirm the target is browser-facing. Do not use this for native SwiftUI/UIKit or Apple-platform screens that do not render through a browser/webview.
2. Use Deep mode when Lighthouse, PageSpeed Insights, CrUX, a DevTools trace, or a live URL with browser tooling is available.
3. Use Quick mode from source when runtime evidence is unavailable.
4. Label source-only findings as potential impact.
5. Never fabricate metrics.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "I can estimate Core Web Vitals from code." | Metrics require evidence. |
| "Native UI performance belongs here." | Native Apple performance uses Apple performance skills instead. |

## Red Flags

- Reported metrics without a source.
- Native UI audited as web performance.
- Recommendations not tied to likely user impact.

## Verification

- Mode is stated as Quick or Deep.
- Measured metrics include their source.
- Unmeasured fields are marked as not measured.

