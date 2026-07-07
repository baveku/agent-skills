# Project AGENTS.md — 📱 React Native lane

Copy this into the root of a React Native repo as `AGENTS.md` (or paste the
`## Skill lane` block into an existing `CLAUDE.md`). It pins the lane so the agent
skips project detection and never reaches for Apple-native, web, or backend skills.

## Skill lane

This is a **React Native** project (react-native / Expo<!-- ; TV target: react-native-tvos / Expo TV / Vega — if so, see the TV note below -->).

- Use the **📱 React Native bucket** + the **Shared bucket** from `rules/skill-routing.md`.
- Ignore Apple/Swift-native, Frontend-web, Backend, Kotlin, and Android-native skills —
  RN work routes through the Callstack router, not through `swiftui-*` or `android-best-practices`.
- Open the `react-native-best-practices` router first — its Problem → Skill Mapping
  covers FPS/jank, re-renders, TTI, bundle size, memory leaks, animations, and native modules.
- Follow its Measure → Optimize → Re-measure → Validate workflow; do not recommend
  memoization or state changes without a measured render/FPS problem.

## TV targets (📺)

If this app targets TV (react-native-tvos, Expo TV, Amazon Vega/Kepler), use
`react-native-tv-best-practices` for focus/D-pad navigation, 10-foot UI layout,
TV playback/DRM, and low-memory TV performance — falling back to
`react-native-best-practices` for general RN surfaces.

## Fast picks

- Slow/janky UI → `react-native-best-practices` → `references/js-measure-fps.md`
- Too many re-renders → `.../js-profile-react.md`
- Slow startup (TTI) → `.../native-measure-tti.md`
- Large bundle/app → `.../bundle-analyze-js.md`, `.../bundle-analyze-app.md`
- Native module work → `.../native-turbo-modules.md`
