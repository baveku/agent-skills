#!/usr/bin/env node
/**
 * validate-commands.js
 *
 * Guards against silent drift across the slash-command directories that still
 * use explicit command files:
 *   .claude/commands/  (.md — Claude Code)
 *   .gemini/commands/  (.toml — legacy Gemini CLI)
 *
 * Antigravity CLI no longer uses TOML command files. Antigravity slash entries
 * are generated from markdown skill files under antigravity/skills/<alias>/SKILL.md.
 *
 * Checks (errors block CI):
 *   - Every command present in one directory exists in all three
 *   - The 'description' field is identical across all three equivalents
 *
 * What this does NOT check:
 *   Prompt body differences are intentional — each tool has its own
 *   syntax ($ARGUMENTS, agent-skills: prefixes, GEMINI.md vs CLAUDE.md).
 *
 * Exit codes: 0 = all clear, 1 = one or more errors
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');

const DIRS = {
  claude:     { dir: path.join(ROOT, '.claude', 'commands'), ext: '.md'   },
  gemini:     { dir: path.join(ROOT, '.gemini', 'commands'), ext: '.toml' },
};

// Commands where the file stem differs between Claude and the legacy TOML dir.
// Key = Claude stem, value = TOML stem.
const NAME_MAP = {
  plan: 'planning',
};
const NAME_MAP_REVERSE = Object.fromEntries(
  Object.entries(NAME_MAP).map(([k, v]) => [v, k])
);

// ─── Parsers ──────────────────────────────────────────────────────────────────

function descriptionFromMd(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match   = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n/);
  if (!match) return null;
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    if (line.slice(0, colonIdx).trim() === 'description') {
      return line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return null;
}

function descriptionFromToml(filePath) {
  const content     = fs.readFileSync(filePath, 'utf8');
  const doubleMatch = content.match(/^description\s*=\s*"((?:[^"\\]|\\.)*)"/m);
  if (doubleMatch) return doubleMatch[1].replace(/\\"/g, '"');
  const singleMatch = content.match(/^description\s*=\s*'([^']*)'/m);
  return singleMatch ? singleMatch[1] : null;
}

// ─── Loader ───────────────────────────────────────────────────────────────────

function loadCommands({ dir, ext }) {
  if (!fs.existsSync(dir)) return {};
  return Object.fromEntries(
    fs.readdirSync(dir)
      .filter(f => f.endsWith(ext))
      .map(f => {
        const stem = path.basename(f, ext);
        const full = path.join(dir, f);
        try {
          const desc = ext === '.md' ? descriptionFromMd(full) : descriptionFromToml(full);
          return [stem, desc];
        } catch (e) {
          console.log(`  ✗  ${stem} — cannot read file: ${e.message}`);
          return [stem, null];
        }
      })
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const byTool = {
    claude:      loadCommands(DIRS.claude),
    gemini:      loadCommands(DIRS.gemini),
  };

  // Canonical command list: use Claude stems as the reference.
  // Map each Claude stem to its TOML equivalent for lookup.
  const claudeStems = Object.keys(byTool.claude).sort();
  const allTomlStems = new Set([
    ...Object.keys(byTool.gemini),
  ]);
  const allCanonicalStems = new Set([
    ...claudeStems,
    ...[...allTomlStems].map(s => NAME_MAP_REVERSE[s] ?? s),
  ]);

  let errors = 0;

  // ── Parity check ────────────────────────────────────────────────────────────
  console.log('Checking command parity...');

  // Commands in Claude not found in the legacy TOML dir
  for (const stem of claudeStems) {
    const tomlStem = NAME_MAP[stem] ?? stem;
    const missing  = [];
    if (!(tomlStem in byTool.gemini))      missing.push('.gemini/commands');
    if (missing.length) {
      console.log(`  ✗  ${stem} — missing in: ${missing.join(', ')}`);
      errors++;
    } else {
      console.log(`  ✓  ${stem}${stem !== tomlStem ? ` (${tomlStem} in .gemini/commands)` : ''}`);
    }
  }

  // Commands in the legacy TOML dir not found in Claude
  for (const stem of [...allTomlStems].sort()) {
    const claudeStem = NAME_MAP_REVERSE[stem] ?? stem;
    if (!(claudeStem in byTool.claude)) {
      console.log(`  ✗  ${stem} — present in .gemini/commands but missing in .claude/commands`);
      errors++;
    }
  }

  // ── Description sync check ──────────────────────────────────────────────────
  console.log('\nChecking description sync...');

  for (const claudeStem of claudeStems) {
    const tomlStem   = NAME_MAP[claudeStem] ?? claudeStem;
    const descClaude = byTool.claude[claudeStem];
    const descGemini = byTool.gemini[tomlStem];

    if (descClaude == null || descGemini == null) {
      // Missing file already flagged by parity check
      continue;
    }

    const allMatch = descClaude === descGemini;

    if (allMatch) {
      console.log(`  ✓  ${claudeStem}`);
    } else {
      console.log(`  ✗  ${claudeStem}`);
      console.log(`       .claude:      ${descClaude}`);
      console.log(`       .gemini:      ${descGemini}`);
      errors++;
    }
  }

  const status = errors > 0 ? 'FAILED' : 'PASSED';
  console.log(`\n${allCanonicalStems.size} commands checked — ${errors} error(s) — ${status}`);

  if (errors > 0) process.exit(1);
}

main();
