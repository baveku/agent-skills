---
name: performance-optimization
description: Optimizes application performance across web and Apple platforms. Use when performance requirements exist, when you suspect performance regressions, when Core Web Vitals or load times need improvement, or when Instruments/MetricKit reveal bottlenecks in iOS/macOS apps. Covers React/TypeScript frontend, backend APIs, and Swift/SwiftUI native apps.
---

# Performance Optimization

## Overview

Measure before optimizing. Performance work without measurement is guessing — and guessing leads to premature optimization that adds complexity without improving what matters. Profile first, identify the actual bottleneck, fix it, measure again. Optimize only what measurements prove matters.

## When to Use

- Performance requirements exist in the spec (load time budgets, response time SLAs)
- Users or monitoring report slow behavior
- Core Web Vitals scores are below thresholds
- You suspect a change introduced a regression
- Building features that handle large datasets or high traffic
- App launch time, hang rate, or memory footprint exceed Apple's recommended thresholds
- Xcode Organizer or MetricKit diagnostics flag regressions
- Scroll hitches or animation drops below 60 fps in Instruments

**When NOT to use:** Don't optimize before you have evidence of a problem. Premature optimization adds complexity that costs more than the performance it gains.

## Performance Metrics

### Web (React/TypeScript) — Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

### Apple (Swift/SwiftUI) — Key Performance Indicators

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| **Launch Time** (time to first frame) | < 400ms | 400ms–1s | > 1s |
| **Hang Rate** (main thread > 250ms) | 0 hangs/hr | < 1 hang/hr | > 1 hang/hr |
| **Memory Footprint** (typical) | < 100MB | 100–200MB | > 200MB |
| **Scroll Hitch Rate** | < 5ms/s | 5–10ms/s | > 10ms/s |
| **Frame Render Time** (16.67ms budget @ 60fps) | < 12ms | 12–16ms | > 16ms |

**MetricKit diagnostics to watch:**
- `MXAppLaunchMetric` — cold/warm/resume launch durations
- `MXAppResponsivenessMetric` — hang time distribution
- `MXMemoryMetric` — peak and average memory
- `MXScrollingMetric` — hitch time ratio
- `MXDiskIOMetric` — excessive disk writes (battery drain)
- `MXCPUExceptionDiagnostic` — CPU limit exceeded events

## The Optimization Workflow

```
1. MEASURE  → Establish baseline with real data
2. IDENTIFY → Find the actual bottleneck (not assumed)
3. FIX      → Address the specific bottleneck
4. VERIFY   → Measure again, confirm improvement
5. GUARD    → Add monitoring or tests to prevent regression
```

### Step 1: Measure

#### Web (React/TypeScript)

Two complementary approaches — use both:

- **Synthetic (Lighthouse, DevTools Performance tab):** Controlled conditions, reproducible. Best for CI regression detection and isolating specific issues.
- **RUM (web-vitals library, CrUX):** Real user data in real conditions. Required to validate that a fix actually improved user experience.

**Frontend:**
```bash
# Synthetic: Lighthouse in Chrome DevTools (or CI)
# Chrome DevTools → Performance tab → Record
# Chrome DevTools MCP → Performance trace

# RUM: Web Vitals library in code
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

**Backend:**
```bash
# Response time logging
# Application Performance Monitoring (APM)
# Database query logging with timing

# Simple timing
console.time('db-query');
const result = await db.query(...);
console.timeEnd('db-query');
```

#### Apple (Swift/SwiftUI)

Four complementary tools — use as needed:

- **Instruments (Time Profiler, SwiftUI profiler, Allocations, Animation Hitches):** Deep offline analysis with call trees, flamegraphs, and allocation tracking. Gold standard for finding root cause.
- **os_signpost / os_log:** Lightweight in-code instrumentation. Zero-cost when not recording. Integrates directly into Instruments timeline.
- **MetricKit:** Aggregated on-device diagnostics from real user sessions. Delivered daily. The Apple equivalent of RUM — required for production validation.
- **Xcode Gauges (Debug Navigator):** Real-time CPU, memory, disk, network monitoring during debug runs. Quick smoke test.

**os_signpost for custom intervals:**
```swift
import os

extension OSLog {
    static let performance = OSLog(
        subsystem: Bundle.main.bundleIdentifier ?? "com.app",
        category: "Performance"
    )
}

// Mark a measured interval in Instruments
func loadDashboard() async throws -> Dashboard {
    let signpostID = OSSignpostID(log: .performance)
    os_signpost(.begin, log: .performance, name: "LoadDashboard", signpostID: signpostID)
    defer {
        os_signpost(.end, log: .performance, name: "LoadDashboard", signpostID: signpostID)
    }

    let data = try await apiClient.fetchDashboard()
    let dashboard = try Dashboard(from: data)
    return dashboard
}
```

**MetricKit subscriber for production diagnostics:**
```swift
import MetricKit

final class PerformanceReporter: NSObject, MXMetricManagerSubscriber, Sendable {
    static let shared = PerformanceReporter()

    func startCollecting() {
        MXMetricManager.shared.add(self)
    }

    nonisolated func didReceive(_ payloads: [MXMetricPayload]) {
        for payload in payloads {
            if let launchMetrics = payload.applicationLaunchMetrics {
                let p50 = launchMetrics.histogrammedTimeToFirstDraw
                    .bucketEnumerator
                // Log or send to your analytics backend
                print("Launch metrics received: \(p50)")
            }
            if let hangMetrics = payload.applicationResponsivenessMetrics {
                print("Hang time: \(hangMetrics.histogrammedApplicationHangTime)")
            }
        }
    }

    nonisolated func didReceive(_ payloads: [MXDiagnosticPayload]) {
        for payload in payloads {
            if let hangDiagnostics = payload.hangDiagnostics {
                for hang in hangDiagnostics {
                    print("Hang call stack: \(hang.callStackTree)")
                }
            }
            if let cpuExceptions = payload.cpuExceptionDiagnostics {
                for exception in cpuExceptions {
                    print("CPU exception: \(exception.callStackTree)")
                }
            }
        }
    }
}
```

### Where to Start Measuring

Use the symptom to decide what to measure first:

#### Web (React/TypeScript)

```
What is slow?
├── First page load
│   ├── Large bundle? --> Measure bundle size, check code splitting
│   ├── Slow server response? --> Measure TTFB in DevTools Network waterfall
│   │   ├── DNS long? --> Add dns-prefetch / preconnect for known origins
│   │   ├── TCP/TLS long? --> Enable HTTP/2, check edge deployment, keep-alive
│   │   └── Waiting (server) long? --> Profile backend, check queries and caching
│   └── Render-blocking resources? --> Check network waterfall for CSS/JS blocking
├── Interaction feels sluggish
│   ├── UI freezes on click? --> Profile main thread, look for long tasks (>50ms)
│   ├── Form input lag? --> Check re-renders, controlled component overhead
│   └── Animation jank? --> Check layout thrashing, forced reflows
├── Page after navigation
│   ├── Data loading? --> Measure API response times, check for waterfalls
│   └── Client rendering? --> Profile component render time, check for N+1 fetches
└── Backend / API
    ├── Single endpoint slow? --> Profile database queries, check indexes
    ├── All endpoints slow? --> Check connection pool, memory, CPU
    └── Intermittent slowness? --> Check for lock contention, GC pauses, external deps
```

#### Apple (Swift/SwiftUI)

```
What is slow?
├── Cold launch takes > 400ms
│   ├── Pre-main time high? --> Check dylib count (< 6 non-system), binary size
│   ├── App init heavy? --> Profile didFinishLaunching in Time Profiler
│   └── First frame delayed? --> Defer non-essential work from @main / App.init
├── App hangs (spinner / frozen UI)
│   ├── Main thread blocked? --> Instruments → System Trace, check main thread
│   ├── Synchronous network/disk? --> Move to async/await or background actor
│   └── Lock contention? --> Check os_unfair_lock / actor reentrancy in System Trace
├── Scroll jank / animation drops
│   ├── Expensive cell bodies? --> Instruments → SwiftUI profiler, check body counts
│   ├── Image decoding on scroll? --> Use .resizable() + AsyncImage or prepareForDisplay()
│   └── Off-screen work? --> Check if LazyVStack/LazyHStack is used vs VStack/HStack
├── Memory growth
│   ├── Steady climb? --> Instruments → Allocations, check for leaks / abandoned memory
│   ├── Spikes on navigation? --> Check for retained view controllers / closures
│   └── SwiftData fault storms? --> Add predicates, limit fetch size, use .fetchLimit
└── Battery drain
    ├── CPU usage high? --> Instruments → Energy Log, check background tasks
    ├── Excessive networking? --> Check URLSession waitsForConnectivity, batch requests
    └── Location/sensors active? --> Audit CLLocationManager accuracy & update frequency
```

### Step 2: Identify the Bottleneck

Common bottlenecks by category:

#### Web (React/TypeScript) — Frontend

| Symptom | Likely Cause | Investigation |
|---------|-------------|---------------|
| Slow LCP | Large images, render-blocking resources, slow server | Check network waterfall, image sizes |
| High CLS | Images without dimensions, late-loading content, font shifts | Check layout shift attribution |
| Poor INP | Heavy JavaScript on main thread, large DOM updates | Check long tasks in Performance trace |
| Slow initial load | Large bundle, many network requests | Check bundle size, code splitting |

#### Web (React/TypeScript) — Backend

| Symptom | Likely Cause | Investigation |
|---------|-------------|---------------|
| Slow API responses | N+1 queries, missing indexes, unoptimized queries | Check database query log |
| Memory growth | Leaked references, unbounded caches, large payloads | Heap snapshot analysis |
| CPU spikes | Synchronous heavy computation, regex backtracking | CPU profiling |
| High latency | Missing caching, redundant computation, network hops | Trace requests through the stack |

#### Apple (Swift/SwiftUI)

| Symptom | Likely Cause | Investigation |
|---------|-------------|---------------|
| Launch > 1s | Heavy App.init, too many dylibs, synchronous I/O at startup | Time Profiler on launch, check pre-main |
| Main thread hangs | Synchronous work on @MainActor, blocking I/O, lock contention | System Trace → Main Thread |
| Scroll hitch > 8ms | Expensive SwiftUI body, image decode on main, no lazy container | Animation Hitches instrument |
| Memory > 200MB | Retained closures, missing [weak self], SwiftData fault storm | Allocations + Leaks instrument |
| Body evaluated > 5×/frame | Unstable identity, @Observable over-notification, inline object creation | SwiftUI instrument, body count |
| Battery drain | Background CPU, aggressive location, unbatched networking | Energy Log instrument |

### Step 3: Fix Common Anti-Patterns

#### N+1 Queries (Backend)

```typescript
// BAD: N+1 — one query per task for the owner
const tasks = await db.tasks.findMany();
for (const task of tasks) {
  task.owner = await db.users.findUnique({ where: { id: task.ownerId } });
}

// GOOD: Single query with join/include
const tasks = await db.tasks.findMany({
  include: { owner: true },
});
```

#### Unbounded Data Fetching

```typescript
// BAD: Fetching all records
const allTasks = await db.tasks.findMany();

// GOOD: Paginated with limits
const tasks = await db.tasks.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' },
});
```

#### Missing Image Optimization (Frontend)

```html
<!-- BAD: No dimensions, no format optimization -->
<img src="/hero.jpg" />

<!-- GOOD: Hero / LCP image — art direction + resolution switching, high priority -->
<!--
  Two techniques combined:
  - Art direction (media): different crop/composition per breakpoint
  - Resolution switching (srcset + sizes): right file size per screen density
-->
<picture>
  <!-- Mobile: portrait crop (8:10) -->
  <source
    media="(max-width: 767px)"
    srcset="/hero-mobile-400.avif 400w, /hero-mobile-800.avif 800w"
    sizes="100vw"
    width="800"
    height="1000"
    type="image/avif"
  />
  <source
    media="(max-width: 767px)"
    srcset="/hero-mobile-400.webp 400w, /hero-mobile-800.webp 800w"
    sizes="100vw"
    width="800"
    height="1000"
    type="image/webp"
  />
  <!-- Desktop: landscape crop (2:1) -->
  <source
    srcset="/hero-800.avif 800w, /hero-1200.avif 1200w, /hero-1600.avif 1600w"
    sizes="(max-width: 1200px) 100vw, 1200px"
    width="1200"
    height="600"
    type="image/avif"
  />
  <source
    srcset="/hero-800.webp 800w, /hero-1200.webp 1200w, /hero-1600.webp 1600w"
    sizes="(max-width: 1200px) 100vw, 1200px"
    width="1200"
    height="600"
    type="image/webp"
  />
  <img
    src="/hero-desktop.jpg"
    width="1200"
    height="600"
    fetchpriority="high"
    alt="Hero image description"
  />
</picture>

<!-- GOOD: Below-the-fold image — lazy loaded + async decoding -->
<img
  src="/content.webp"
  width="800"
  height="400"
  loading="lazy"
  decoding="async"
  alt="Content image description"
/>
```

#### Unnecessary Re-renders (React)

```tsx
// BAD: Creates new object on every render, causing children to re-render
function TaskList() {
  return <TaskFilters options={{ sortBy: 'date', order: 'desc' }} />;
}

// GOOD: Stable reference
const DEFAULT_OPTIONS = { sortBy: 'date', order: 'desc' } as const;
function TaskList() {
  return <TaskFilters options={DEFAULT_OPTIONS} />;
}

// Use React.memo for expensive components
const TaskItem = React.memo(function TaskItem({ task }: Props) {
  return <div>{/* expensive render */}</div>;
});

// Use useMemo for expensive computations
function TaskStats({ tasks }: Props) {
  const stats = useMemo(() => calculateStats(tasks), [tasks]);
  return <div>{stats.completed} / {stats.total}</div>;
}
```

#### Large Bundle Size

```typescript
// Modern bundlers (Vite, webpack 5+) handle named imports with tree-shaking automatically,
// provided the dependency ships ESM and is marked `sideEffects: false` in package.json.
// Profile before changing import styles — the real gains come from splitting and lazy loading.

// GOOD: Dynamic import for heavy, rarely-used features
const ChartLibrary = lazy(() => import('./ChartLibrary'));

// GOOD: Route-level code splitting wrapped in Suspense
const SettingsPage = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <SettingsPage />
    </Suspense>
  );
}
```

#### Missing Caching (Backend)

```typescript
// Cache frequently-read, rarely-changed data
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedConfig: AppConfig | null = null;
let cacheExpiry = 0;

async function getAppConfig(): Promise<AppConfig> {
  if (cachedConfig && Date.now() < cacheExpiry) {
    return cachedConfig;
  }
  cachedConfig = await db.config.findFirst();
  cacheExpiry = Date.now() + CACHE_TTL;
  return cachedConfig;
}

// HTTP caching headers for static assets
app.use('/static', express.static('public', {
  maxAge: '1y',           // Cache for 1 year
  immutable: true,        // Never revalidate (use content hashing in filenames)
}));

// Cache-Control for API responses
res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
```

#### SwiftUI Body Re-evaluation (SwiftUI)

```swift
// BAD: Entire list re-evaluated because inline object breaks identity
struct TaskListView: View {
    @State private var tasks: [TaskItem] = []

    var body: some View {
        List(tasks) { task in
            // Creates a new DateFormatter every body evaluation
            HStack {
                Text(task.title)
                Spacer()
                Text(DateFormatter.shortDate.string(from: task.dueDate))
            }
        }
    }
}

// Extension used below — define once, reuse everywhere
extension DateFormatter {
    static let shortDate: DateFormatter = {
        let f = DateFormatter()
        f.dateStyle = .short
        return f
    }()
}

// GOOD: Extracted subview with stable identity, formatter shared
struct TaskListView: View {
    @State private var tasks: [TaskItem] = []

    var body: some View {
        List(tasks) { task in
            TaskRowView(task: task)
        }
    }
}

struct TaskRowView: View {
    let task: TaskItem

    var body: some View {
        HStack {
            Text(task.title)
            Spacer()
            Text(task.dueDate, format: .dateTime.month().day())
        }
    }
}
```

#### @Observable Over-notification (SwiftUI)

```swift
// BAD: Reading any property subscribes the view to ALL changes
@Observable
final class AppState {
    var user: User?
    var tasks: [TaskItem] = []
    var settings: Settings = .default
    var networkStatus: NetworkStatus = .connected
    var analyticsBuffer: [Event] = []  // changes frequently
}

struct TaskListView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        // This view re-evaluates when analyticsBuffer changes
        // even though it only reads tasks
        List(appState.tasks) { task in
            Text(task.title)
        }
    }
}

// GOOD: Split into focused observable objects
@Observable
final class TaskStore {
    var tasks: [TaskItem] = []

    func fetch() async throws {
        tasks = try await apiClient.fetchTasks()
    }
}

@Observable
final class AnalyticsStore {
    var buffer: [Event] = []  // high-frequency changes isolated
}

struct TaskListView: View {
    @Environment(TaskStore.self) private var taskStore

    var body: some View {
        // Only re-evaluates when tasks change
        List(taskStore.tasks) { task in
            Text(task.title)
        }
    }
}
```

#### Missing Lazy Containers (SwiftUI)

```swift
// BAD: VStack evaluates ALL children upfront — O(n) body calls on appear
struct AllTasksView: View {
    let tasks: [TaskItem]  // could be 10,000 items

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                ForEach(tasks) { task in
                    TaskRowView(task: task) // all 10,000 rows built immediately
                }
            }
        }
    }
}

// GOOD: LazyVStack only evaluates visible rows
struct AllTasksView: View {
    let tasks: [TaskItem]

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 8) {
                ForEach(tasks) { task in
                    TaskRowView(task: task) // only visible rows built
                }
            }
        }
    }
}
```

#### Synchronous Main Actor Work (Swift)

```swift
// BAD: Blocking the main actor with heavy computation
@MainActor
final class ReportViewModel: ObservableObject {
    @Published var report: Report?

    func generateReport(from data: [DataPoint]) {
        // This runs on main actor — blocks UI for seconds
        let processed = data.map { expensiveTransform($0) }
        let aggregated = aggregate(processed)
        report = Report(data: aggregated)
    }
}

// GOOD: Offload heavy work to a background context
@MainActor
final class ReportViewModel: ObservableObject {
    @Published var report: Report?
    @Published var isGenerating = false

    func generateReport(from data: [DataPoint]) async {
        isGenerating = true
        defer { isGenerating = false }

        // Heavy work runs off the main actor
        let result = await Task.detached(priority: .userInitiated) {
            let processed = data.map { expensiveTransform($0) }
            let aggregated = aggregate(processed)
            return Report(data: aggregated)
        }.value

        report = result // UI update back on main actor
    }
}
```

#### SwiftData Without Predicates

```swift
// BAD: Fetches ALL records, filters in memory
@Query var tasks: [TaskItem]

var overdueTasks: [TaskItem] {
    tasks.filter { $0.dueDate < .now && !$0.isCompleted }
}

// GOOD: Predicate pushes filter to SQLite
@Query(
    filter: #Predicate<TaskItem> { task in
        task.dueDate < Date.now && !task.isCompleted
    },
    sort: \.dueDate
) var overdueTasks: [TaskItem]

// GOOD: Paginated fetch for large datasets
@Query(
    sort: \.createdAt, order: .reverse,
    animation: .default
) var recentTasks: [TaskItem]

// In ModelContext for manual fetches:
func fetchPage(offset: Int, limit: Int, in context: ModelContext) throws -> [TaskItem] {
    var descriptor = FetchDescriptor<TaskItem>(
        predicate: #Predicate { !$0.isArchived },
        sortBy: [SortDescriptor(\.createdAt, order: .reverse)]
    )
    descriptor.fetchOffset = offset
    descriptor.fetchLimit = limit
    return try context.fetch(descriptor)
}
```

## Performance Budget

Set budgets and enforce them:

### Web (React/TypeScript)

```
JavaScript bundle: < 200KB gzipped (initial load)
CSS: < 50KB gzipped
Images: < 200KB per image (above the fold)
Fonts: < 100KB total
API response time: < 200ms (p95)
Time to Interactive: < 3.5s on 4G
Lighthouse Performance score: ≥ 90
```

**Enforce in CI:**
```bash
# Bundle size check
npx bundlesize --config bundlesize.config.json

# Lighthouse CI
npx lhci autorun
```

### Apple (Swift/SwiftUI)

```
App binary size (thin): < 30MB (cellular download limit is 200MB)
Cold launch to first frame: < 400ms
Warm launch to first frame: < 200ms
Resume (background → foreground): < 100ms
Memory footprint (typical use): < 100MB
Memory footprint (peak): < 300MB (avoid OOM jetsam on 3GB devices)
Frame render time: < 12ms (leaves 4ms headroom for 60fps)
Scroll hitch ratio: < 5ms/s
Main thread hang time: 0 hangs > 250ms per session
Disk writes: < 100MB/day (battery impact)
```

**Enforce in CI / Xcode:**
```bash
# Binary size check (after archive)
xcrun lipo -info MyApp.app/MyApp
du -sh MyApp.app

# Launch time via xcodebuild test
xcodebuild test -scheme MyApp \
  -destination 'platform=iOS Simulator,name=iPhone 16' \
  -only-testing:MyAppPerformanceTests/testLaunchPerformance

# Memory via XCTest
# Use XCTMemoryMetric in performance tests
```

**XCTest performance test example:**
```swift
import XCTest

final class LaunchPerformanceTests: XCTestCase {
    func testLaunchPerformance() throws {
        measure(metrics: [
            XCTApplicationLaunchMetric(),
            XCTMemoryMetric(application: XCUIApplication()),
            XCTClockMetric()
        ]) {
            XCUIApplication().launch()
        }
    }

    func testScrollPerformance() throws {
        let app = XCUIApplication()
        app.launch()

        let list = app.collectionViews.firstMatch

        measure(metrics: [XCTOSSignpostMetric.scrollDecelerationMetric]) {
            list.swipeUp(velocity: .fast)
        }
    }
}
```

## See Also

For detailed performance checklists, optimization commands, and anti-pattern reference, see `references/performance-checklist.md`.


## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "We'll optimize later" | Performance debt compounds. Fix obvious anti-patterns now, defer micro-optimizations. |
| "It's fast on my machine" | Your machine isn't the user's. Profile on representative hardware and networks. |
| "This optimization is obvious" | If you didn't measure, you don't know. Profile first. |
| "Users won't notice 100ms" | Research shows 100ms delays impact conversion rates. Users notice more than you think. |
| "The framework handles performance" | Frameworks prevent some issues but can't fix N+1 queries or oversized bundles. |
| "The latest iPhone is fast enough" | Most users aren't on the latest device. Test on iPhone SE / iPad mini. MetricKit data reflects real fleet. |
| "SwiftUI is declarative, it's automatically efficient" | SwiftUI diffing is fast but not free. Unstable identity, over-broad @Observable, and missing lazy containers multiply body evaluations. |
| "@Observable replaces all state management" | @Observable is convenient but coarse-grained by default. Split high-frequency state into separate objects or the entire UI re-evaluates on every change. |

## Red Flags

### Web (React/TypeScript)

- Optimization without profiling data to justify it
- N+1 query patterns in data fetching
- List endpoints without pagination
- Images without dimensions, lazy loading, or responsive sizes
- Bundle size growing without review
- No performance monitoring in production
- `React.memo` and `useMemo` everywhere (overusing is as bad as underusing)

### Apple (Swift/SwiftUI)

- Optimization without Instruments trace or MetricKit data to justify it
- Synchronous network, disk I/O, or JSON parsing on the main actor
- `VStack`/`HStack` in `ScrollView` with large data sets instead of `LazyVStack`/`LazyHStack`
- Single god `@Observable` object that the entire view hierarchy depends on
- `@Query` without `#Predicate` on large SwiftData stores
- No `XCTMetric`-based performance tests in the test suite
- Images decoded at full resolution without downsampling (`UIImage(named:)` for large assets)
- Timer/location/sensor running at unnecessarily high frequency
- Missing `[weak self]` in long-lived closures causing retained view models
- No MetricKit subscriber in production builds — flying blind on real-device performance

## Verification

After any performance-related change:

### Web (React/TypeScript)

- [ ] Before and after measurements exist (specific numbers)
- [ ] The specific bottleneck is identified and addressed
- [ ] Core Web Vitals are within "Good" thresholds
- [ ] Bundle size hasn't increased significantly
- [ ] No N+1 queries in new data fetching code
- [ ] Performance budget passes in CI (if configured)
- [ ] Existing tests still pass (optimization didn't break behavior)

### Apple (Swift/SwiftUI)

- [ ] Before and after Instruments traces exist with specific numbers
- [ ] The specific bottleneck is identified in Time Profiler / Allocations / System Trace
- [ ] Launch time is under 400ms (cold) measured via `XCTApplicationLaunchMetric`
- [ ] No main thread hangs > 250ms verified in System Trace
- [ ] Scroll hitch ratio < 5ms/s verified in Animation Hitches instrument
- [ ] Memory footprint stays under budget (check Allocations instrument or Xcode Memory Gauge)
- [ ] `XCTMetric` performance tests added/updated and passing in CI
- [ ] MetricKit subscriber is active in production to catch regressions on real devices
- [ ] Existing tests still pass (optimization didn't break behavior)
