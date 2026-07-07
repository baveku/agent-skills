#!/usr/bin/env node
/**
 * validate-skills.js
 *
 * Validates every skill in skills/ against the rules in docs/skill-anatomy.md.
 *
 * Checks (errors block CI):
 *   - SKILL.md exists in every skill directory
 *   - YAML frontmatter present with 'name' and 'description' fields
 *   - frontmatter 'name' matches the directory name
 *   - directory name is lowercase-hyphen-separated (skill-anatomy.md: Naming Conventions)
 *   - description does not exceed 1024 characters
 *   - description includes a 'when to use' trigger (skill-anatomy.md: Required)
 *   - required sections are present
 *
 * Checks (warnings, do not block CI):
 *   - cross-skill references point to known skills
 *
 * Exit codes: 0 = all clear, 1 = one or more errors
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────────────────────────

const SKILLS_DIR = path.resolve(__dirname, '..', 'skills');

const MAX_DESCRIPTION_LENGTH = 1024;

// A skill directory name must be lowercase-hyphen-separated
// (docs/skill-anatomy.md → Naming Conventions).
const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// A description must state WHEN to use the skill, not just what it does
// (docs/skill-anatomy.md → Required). Accept the canonical "Use when …"
// plus the equivalent "Use before/after/during …" phrasings in use today.
const DESCRIPTION_TRIGGER = /\buse (this )?when\b|\buse (before|after|during)\b/i;

// Sections every standard SKILL.md must contain.
// Each entry is an array of acceptable heading strings — the first
// match wins, so you can list canonical + legacy aliases.
const REQUIRED_SECTIONS = [
  ['## Overview'],
  ['## When to Use'],
  ['## Common Rationalizations'],
  ['## Red Flags'],
  ['## Verification'],
];

// Skills that are intentionally exempt from section checks.
// Exemptions live HERE, not in skill frontmatter, so contributors
// cannot bypass the validator by editing their own skill file.
// Every entry must have a documented reason.
const SECTION_EXEMPT_SKILLS = {
  'using-agent-skills': 'Meta-skill — orchestrates other skills; When-to-Use and Verification are not applicable to a routing document.',
  'idea-refine':        'Legacy structure predating skill-anatomy.md — uses How-It-Works/Usage/Anti-patterns instead of standard headings. Tracked for conformance in https://github.com/addyosmani/agent-skills/issues',
};

// Imported Apple/platform skills are kept close to their source format so they
// can be updated manually without rewriting upstream content on every sync.
// They still need SKILL.md frontmatter with name + description, but the
// repository-specific anatomy rules below are not enforced for them.
const NONSTANDARD_IMPORTED_SKILLS = {
  'appstore-aso':                  'Imported Apple/App Store skill with upstream name and workflow format.',
  'appstore-review':               'Imported Apple/App Store skill with upstream workflow format.',
  'asc-cli-usage':                 'Imported App Store Connect CLI skill with upstream workflow format.',
  'asc-crash-triage':              'Imported App Store Connect CLI skill with upstream workflow format.',
  'asc-release-flow':              'Imported App Store Connect CLI skill with upstream workflow format.',
  'asc-signing-setup':             'Imported App Store Connect CLI skill with upstream workflow format.',
  'asc-submission-health':         'Imported App Store Connect CLI skill with upstream workflow format.',
  'asc-testflight-orchestration':  'Imported App Store Connect CLI skill with upstream workflow format.',
  'asc-xcode-build':               'Imported App Store Connect CLI skill with upstream workflow format.',
  'audit-xcode-security':          'Imported Apple security skill with upstream name and workflow format.',
  'bug-hunt-swarm':                'Imported swarm skill with upstream workflow format.',
  'c-bounds-safety':               'Imported C safety skill with upstream workflow format.',
  'device-interaction':            'Imported Apple device interaction skill with upstream workflow format.',
  'github-cli':                    'Imported GitHub CLI skill with upstream name and workflow format.',
  'ios-accessibility':             'Imported iOS accessibility skill with upstream workflow format.',
  'ios-debugger-agent':            'Imported iOS debugger skill with upstream workflow format.',
  'macos-spm-packaging':           'Imported macOS packaging skill with upstream name and workflow format.',
  'modernize-tests':               'Imported Swift testing migration skill with upstream workflow format.',
  'adaptive':                                     'Imported Google Android skill with upstream workflow format.',
  'agp-9-upgrade':                                'Imported Google Android skill with upstream workflow format.',
  'android-cli':                                  'Imported Google Android skill with upstream workflow format.',
  'android-intent-security':                      'Imported Google Android skill with upstream workflow format.',
  'appfunctions':                                 'Imported Google Android skill with upstream workflow format.',
  'camerax':                                      'Imported Google Android skill with upstream workflow format.',
  'display-glasses-with-jetpack-compose-glimmer': 'Imported Google Android skill with upstream workflow format.',
  'edge-to-edge':                                 'Imported Google Android skill with upstream workflow format.',
  'engage-sdk-integration':                       'Imported Google Android skill with upstream workflow format.',
  'migrate-xml-views-to-jetpack-compose':         'Imported Google Android skill with upstream workflow format.',
  'navigation-3':                                 'Imported Google Android skill with upstream workflow format.',
  'perfetto-sql':                                 'Imported Google Android skill with upstream workflow format.',
  'perfetto-trace-analysis':                      'Imported Google Android skill with upstream workflow format.',
  'play-billing-library-version-upgrade':         'Imported Google Android skill with upstream workflow format.',
  'r8-analyzer':                                  'Imported Google Android skill with upstream workflow format.',
  'styles':                                       'Imported Google Android skill with upstream workflow format.',
  'testing-setup':                                'Imported Google Android skill with upstream workflow format.',
  'verified-email':                               'Imported Google Android skill with upstream workflow format.',
  'wear-compose-m3':                              'Imported Google Android skill with upstream workflow format.',
  'kotlin-backend-jpa-entity-mapping':                    'Imported JetBrains Kotlin skill with upstream workflow format.',
  'kotlin-tooling-agp9-migration':                        'Imported JetBrains Kotlin skill with upstream workflow format.',
  'kotlin-tooling-cocoapods-spm-migration':               'Imported JetBrains Kotlin skill with upstream workflow format.',
  'kotlin-tooling-immutable-collections-0-5-x-migration': 'Imported JetBrains Kotlin skill with upstream workflow format.',
  'kotlin-tooling-java-to-kotlin':                        'Imported JetBrains Kotlin skill with upstream workflow format.',
  'react-native-best-practices':     'Imported Callstack RN performance skill with upstream workflow format.',
  'react-native-tv-best-practices':  'Imported Callstack RN TV skill with upstream workflow format.',
  'review-swarm':                  'Imported swarm skill with upstream workflow format.',
  'swift-architecture':            'Imported Swift architecture skill with upstream name and workflow format.',
  'swift-concurrency-pro':         'Imported Swift concurrency skill with upstream workflow format.',
  'swift-security-expert':         'Imported Swift security skill with upstream workflow format.',
  'swift-testing-pro':             'Imported Swift Testing skill with upstream workflow format.',
  'swiftdata-pro':                 'Imported SwiftData skill with upstream workflow format.',
  'swiftui-accessibility-auditor': 'Imported SwiftUI accessibility skill with upstream workflow format.',
  'swiftui-liquid-glass':          'Imported SwiftUI Liquid Glass skill with upstream workflow format.',
  'swiftui-performance-audit':     'Imported SwiftUI performance skill with upstream workflow format.',
  'swiftui-pro':                   'Imported SwiftUI review skill with upstream workflow format.',
  'swiftui-specialist':            'Imported SwiftUI specialist skill with upstream workflow format.',
  'swiftui-ui-patterns':           'Imported SwiftUI UI skill with upstream workflow format.',
  'swiftui-view-refactor':         'Imported SwiftUI refactor skill with upstream workflow format.',
  'swiftui-whats-new-27':          'Imported SwiftUI SDK update skill with upstream workflow format.',
  'uikit-accessibility-auditor':   'Imported UIKit accessibility skill with upstream workflow format.',
  'uikit-modernization':           'Imported UIKit modernization skill with upstream name and workflow format.',
};

// Regex patterns that indicate an explicit cross-skill reference.
// Only these patterns trigger the dead-reference warning — generic
// backtick strings in code blocks are intentionally excluded.
const SKILL_REF_PATTERNS = [
  /\buse the `([a-z][a-z0-9-]+[a-z0-9])` skill/g,
  /\bfollow the `([a-z][a-z0-9-]+[a-z0-9])` skill/g,
  /\binvoke the `([a-z][a-z0-9-]+[a-z0-9])` skill/g,
  /\bcontinue with `([a-z][a-z0-9-]+[a-z0-9])`/g,
  /\buse `([a-z][a-z0-9-]+[a-z0-9])` skill/g,
  /`([a-z][a-z0-9-]+[a-z0-9])` skill\b/g,
  /`([a-z][a-z0-9-]+[a-z0-9])` persona\b/g,
  /\bsee `([a-z][a-z0-9-]+[a-z0-9])`/g,
  /──→ ([a-z][a-z0-9-]+[a-z0-9])\b/g,          // ASCII diagram arrows
  /→ `([a-z][a-z0-9-]+[a-z0-9])`/g,
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parse YAML-style frontmatter from the top of a markdown file.
 * Returns a key→value object, or null if no frontmatter block found.
 * Values are stripped of surrounding quotes.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n/);
  if (!match) return null;

  const result = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key   = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key) result[key] = value;
  }
  return result;
}

/**
 * Collect all explicit skill cross-references from content.
 * Only matches against the SKILL_REF_PATTERNS list to avoid
 * false-positives from inline code snippets.
 */
function extractSkillReferences(content) {
  const refs = new Set();
  for (const pattern of SKILL_REF_PATTERNS) {
    // Reset lastIndex for global regexes
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(content)) !== null) {
      refs.add(m[1]);
    }
  }
  return refs;
}

// ─── Validator ───────────────────────────────────────────────────────────────

function validateSkill(dirName, knownSkills) {
  const errors   = [];
  const warnings = [];
  let   label    = '';
  const skillPath = path.join(SKILLS_DIR, dirName, 'SKILL.md');

  if (!fs.existsSync(skillPath)) {
    errors.push('Missing SKILL.md');
    return { errors, warnings, exempt };
  }

  let content;
  try {
    content = fs.readFileSync(skillPath, 'utf8');
  } catch (err) {
    errors.push(`Unreadable SKILL.md: ${err.message}`);
    return { errors, warnings, exempt };
  }

  // ── Frontmatter ──────────────────────────────────────────────────────────
  const fm = parseFrontmatter(content);
  if (!fm) {
    errors.push('Missing or malformed YAML frontmatter (expected --- block at top of file)');
    return { errors, warnings, label };
  }

  // dirName may be a nested path (e.g. swift-best-practices/references/<name>);
  // allowlists and the name check key off the leaf directory name.
  const baseName = path.basename(dirName);
  const nonstandardImported = baseName in NONSTANDARD_IMPORTED_SKILLS;

  if (!fm.name) {
    errors.push("Frontmatter missing required field: 'name'");
  } else if (!nonstandardImported && fm.name !== baseName) {
    errors.push(`Frontmatter name '${fm.name}' does not match directory name '${baseName}'`);
  }

  if (!KEBAB_CASE.test(baseName)) {
    errors.push(`Directory name '${baseName}' is not lowercase-hyphen-separated (skill-anatomy.md: Naming Conventions)`);
  }

  if (!fm.description) {
    errors.push("Frontmatter missing required field: 'description'");
  } else {
    if (!nonstandardImported && fm.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push(
        `Description is ${fm.description.length} chars — exceeds the ${MAX_DESCRIPTION_LENGTH}-char limit` +
        ` (agents inject this into the system prompt)`
      );
    }
    if (!nonstandardImported && !DESCRIPTION_TRIGGER.test(fm.description)) {
      errors.push(
        `Description has no 'when to use' trigger — add a "Use when …" clause ` +
        `(skill-anatomy.md: Required — the description must say both what the skill does and when to use it)`
      );
    }
  }

  // ── Exemption guard ──────────────────────────────────────────────────────
  // Exemptions are validator-owned (SECTION_EXEMPT_SKILLS above).
  // If a skill's frontmatter tries to declare its own exemption, fail loud —
  // that's a sign someone is trying to bypass the validator.
  if (fm.type === 'meta' || fm.exempt === 'sections') {
    if (!SECTION_EXEMPT_SKILLS[baseName]) {
      errors.push(
        `Frontmatter declares 'type: meta' or 'exempt: sections' but '${dirName}' is not in ` +
        `the validator's SECTION_EXEMPT_SKILLS allowlist. ` +
        `Add an entry to scripts/validate-skills.js with a documented reason.`
      );
    }
  }

  // ── Required sections ────────────────────────────────────────────────────
  const sectionExempt = baseName in SECTION_EXEMPT_SKILLS || nonstandardImported;
  if (nonstandardImported) {
    label = ' (nonstandard imported skill)';
  } else if (dirName in SECTION_EXEMPT_SKILLS) {
    label = ' (section checks exempt)';
  }

  if (!sectionExempt) {
    for (const aliases of REQUIRED_SECTIONS) {
      const found = aliases.some(heading => content.includes(heading));
      if (!found) {
        errors.push(`Missing required section: ${aliases[0]}`);
      }
    }
  }

  // ── Cross-skill references ───────────────────────────────────────────────
  const refs = extractSkillReferences(content);
  for (const ref of refs) {
    if (!knownSkills.has(ref)) {
      warnings.push(`Dead cross-reference: \`${ref}\` is not a known skill`);
    }
  }

  return { errors, warnings, label };
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`ERROR: skills directory not found at ${SKILLS_DIR}`);
    process.exit(1);
  }

  const skillDirs = fs.readdirSync(SKILLS_DIR)
    .filter(d => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory())
    .sort();

  // Lane routers keep their domain skills nested under references/ so hosts
  // that auto-load skills/ (Antigravity) only see the router. Validate the
  // nested skills too, and let cross-references resolve to their leaf names.
  const NESTED_SKILL_ROOTS = [
    'swift-best-practices/references',
    'web-best-practices/references',
    'backend-best-practices/references',
    'kotlin-best-practices/references',
    'android-best-practices/references',
  ];
  const nestedDirs = [];
  for (const root of NESTED_SKILL_ROOTS) {
    const abs = path.join(SKILLS_DIR, root);
    if (!fs.existsSync(abs)) continue;
    for (const d of fs.readdirSync(abs).sort()) {
      if (fs.statSync(path.join(abs, d)).isDirectory()) nestedDirs.push(`${root}/${d}`);
    }
  }

  const allDirs = [...skillDirs.filter(d => !NESTED_SKILL_ROOTS.some(r => r.startsWith(d + '/') || r === d)), ...nestedDirs];
  // The router itself is still a top-level skill — keep it in the list.
  if (skillDirs.includes('swift-best-practices')) allDirs.unshift('swift-best-practices');

  const knownSkills = new Set([...skillDirs, ...nestedDirs.map(d => path.basename(d))]);

  let totalErrors   = 0;
  let totalWarnings = 0;

  for (const dirName of allDirs) {
    const { errors, warnings, label } = validateSkill(dirName, knownSkills);
    totalErrors   += errors.length;
    totalWarnings += warnings.length;

    if (errors.length === 0 && warnings.length === 0) {
      console.log(`  ✓  ${dirName}${label}`);
    } else {
      const icon = errors.length > 0 ? '  ✗ ' : '  ⚠ ';
      console.log(`${icon} ${dirName}`);
      for (const msg of errors)   console.log(`       ERROR: ${msg}`);
      for (const msg of warnings) console.log(`       WARN:  ${msg}`);
    }
  }

  const status = totalErrors > 0 ? 'FAILED' : totalWarnings > 0 ? 'PASSED WITH WARNINGS' : 'PASSED';
  console.log(`\n${allDirs.length} skills checked (${skillDirs.length} top-level, ${nestedDirs.length} nested) — ${totalErrors} error(s), ${totalWarnings} warning(s) — ${status}`);

  if (totalErrors > 0) process.exit(1);
}

// Surface unexpected failures (fs errors, bad symlinks, …) as a structured
// one-line CI error instead of an uncaught stack trace.
try {
  main();
} catch (err) {
  console.error(`\nERROR: validate-skills failed unexpectedly: ${err.message}`);
  process.exit(1);
}
