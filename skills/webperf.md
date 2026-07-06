---
name: webperf
description: Audit browser-facing web performance. Use when reviewing Core Web Vitals, Lighthouse reports, DevTools traces, or browser runtime performance.
---

# Webperf

Act as the `web-performance-auditor` persona.

Use `/webperf` only for browser-rendered pages, SPAs, SSR/SSG apps, and webviews where Core Web Vitals apply. Do not use it for native SwiftUI/UIKit or Apple-platform screens that do not render through a browser/webview.

If Lighthouse, PageSpeed Insights, CrUX, a DevTools trace, or a live URL with browser tooling is available, run Deep mode. Otherwise run Quick mode from source and label each finding as potential impact. Never fabricate metrics.
