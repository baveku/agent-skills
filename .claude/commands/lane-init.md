---
description: Detect the project's lane and pin it into AGENTS.md — creates or updates the "## Skill lane" block so agents skip detection
---

`/lane-init` pins the current project's routing lane into its `AGENTS.md`, so every future session skips lane detection and never reaches for another lane's skills. Re-running it replaces the existing block — it never duplicates.

## 1. Detect the lane

Apply the Project Detection table in `rules/skill-routing.md` against the repo root (or `$ARGUMENTS` if a subdirectory is given). Respect the ordering — it exists because signals overlap:

1. 📱 React Native (`package.json` with react-native/expo) — before 🌐; TV-targeted RN (react-native-tvos, Expo TV, Vega) → 📺
2. 🍎 Apple/Swift (`*.xcodeproj`, `Package.swift`, `*.swift`)
3. 🤖 Android (`AndroidManifest.xml`, `com.android.application`, Compose deps) — before 🅺
4. 🅺 Kotlin (`*.kt`, `build.gradle.kts`, KMP layout) — before ⚙️
5. 🌐 Frontend (react/vue/svelte/vite `package.json`, `*.tsx`)
6. ⚙️ Backend/API (`go.mod`, `Cargo.toml`, server `package.json`, `pyproject.toml`, `Dockerfile`+API)

Collect the actual evidence (which files matched). Then:

- **One lane matches** → proceed.
- **Multiple lanes match (monorepo)** → ask the user: one `AGENTS.md` per package directory (preferred), or a single root block listing the lane per directory.
- **Nothing matches** → tell the user what you looked for and ask them to name the lane; do not guess.

## 2. Build the block

The lane templates in `docs/lane-templates/AGENTS.<lane>.md` (in the agent-skills repo/plugin) are the source of truth — copy the `## Skill lane` section (and lane-specific extras: the TV note for RN, cross-lane notes for Kotlin/Android) from the matching template, then fill in the project's actual stack details (framework, TV target, backend stack) from what you detected.

If the template files are not reachable in this environment, reconstruct the block from this shape plus the lane's row in `rules/skill-routing.md`:

```markdown
## Skill lane

This is a **<Lane>** project (<detected stack details>).

- Use the **<emoji> <Lane> bucket** + the **Shared bucket** from `rules/skill-routing.md`.
- Open the `<lane>-best-practices` router first — its table maps each surface to the reference to read.
- Ignore other lanes' skills; cross lanes only for genuinely cross-cutting work and say so.
```

## 3. Write it

- `AGENTS.md` exists → if a `## Skill lane` section is already present, **replace that section only**; otherwise append the block. Touch nothing else in the file.
- No `AGENTS.md` but `CLAUDE.md` exists → offer both options: add the block to `CLAUDE.md`, or create `AGENTS.md` with just the block. Follow the user's pick.
- Neither exists → create `AGENTS.md` containing the block.

## 4. Confirm

Show the user the detected lane with its evidence and the exact block before writing. This edits their project file — do not write without an explicit yes.

After writing, state where the block landed and remind them: the pin **overrides** detection for all future sessions; re-run `/lane-init` after a stack change (e.g. adding RN to a native app) or delete the block to restore auto-detection.
