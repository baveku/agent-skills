---
name: webperf
description: Audit browser-facing web performance. Use when reviewing Core Web Vitals, Lighthouse reports, DevTools traces, or browser runtime performance.
---

# Webperf

## Overview

Antigravity slash alias for web performance review.

## When to Use

- The user invokes `/webperf`.
- A browser-rendered page, SPA, SSR/SSG app, or webview needs performance review.
- Lighthouse, PageSpeed Insights, CrUX, or DevTools trace evidence is available.

## Process

1. Apply `rules/skill-routing.md`.
2. Use the web performance auditor persona from `agents/web-performance-auditor.md`.
3. Do not use this for native SwiftUI/UIKit or Apple-platform screens that do not render through a browser/webview.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "This alias has enough instructions." | The specialist persona owns the audit workflow; use it. |

## Red Flags

- The alias is followed without the specialist persona.
- Routing rules are ignored.

## Verification

- Web performance auditor verification is satisfied.
