#!/usr/bin/env node
/**
 * validate-commands.js
 *
 * Guards against silent drift between Claude Code command files and
 * Antigravity skill-generated slash aliases.
 *
 * Legacy TOML command files were removed after their host CLI deprecation.
 *
 * Checks (errors block CI):
 *   - Every expected Claude command exists
 *   - Every matching Antigravity alias skill exists
 *   - Claude command files have description frontmatter
 *   - Antigravity alias skills have matching name frontmatter
 *
 * Exit codes: 0 = all clear, 1 = one or more errors
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const COMMANDS = [
  { command: 'build',         alias: 'build' },
  { command: 'code-simplify', alias: 'code-simplify' },
  { command: 'plan',          alias: 'planning' },
  { command: 'review',        alias: 'review' },
  { command: 'ship',          alias: 'ship' },
  { command: 'spec',          alias: 'spec' },
  { command: 'test',          alias: 'test' },
  { command: 'webperf',       alias: 'webperf' },
];

function frontmatter(content) {
  const match = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n/);
  if (!match) return null;

  const result = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key) result[key] = value;
  }
  return result;
}

function readFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) return { missing: true };
  const content = fs.readFileSync(filePath, 'utf8');
  const fm = frontmatter(content);
  return fm ? { fm } : { malformed: true };
}

function main() {
  let errors = 0;

  console.log('Checking slash entry points...');

  for (const { command, alias } of COMMANDS) {
    const claudePath = path.join(ROOT, '.claude', 'commands', `${command}.md`);
    const aliasPath = path.join(ROOT, 'skills', alias, 'SKILL.md');
    const claude = readFrontmatter(claudePath);
    const antigravity = readFrontmatter(aliasPath);
    const problems = [];

    if (claude.missing) {
      problems.push(`missing ${path.relative(ROOT, claudePath)}`);
    } else if (claude.malformed) {
      problems.push(`malformed frontmatter in ${path.relative(ROOT, claudePath)}`);
    } else if (!claude.fm.description) {
      problems.push(`missing description in ${path.relative(ROOT, claudePath)}`);
    }

    if (antigravity.missing) {
      problems.push(`missing ${path.relative(ROOT, aliasPath)}`);
    } else if (antigravity.malformed) {
      problems.push(`malformed frontmatter in ${path.relative(ROOT, aliasPath)}`);
    } else if (antigravity.fm.name !== alias) {
      problems.push(
        `${path.relative(ROOT, aliasPath)} has name '${antigravity.fm.name ?? '(missing)'}', expected '${alias}'`
      );
    } else if (!antigravity.fm.description) {
      problems.push(`missing description in ${path.relative(ROOT, aliasPath)}`);
    }

    if (problems.length) {
      console.log(`  ✗  /${command}`);
      for (const problem of problems) console.log(`       ERROR: ${problem}`);
      errors++;
    } else {
      const suffix = command === alias ? '' : ` → /${alias}`;
      console.log(`  ✓  /${command}${suffix}`);
    }
  }

  const status = errors > 0 ? 'FAILED' : 'PASSED';
  console.log(`\n${COMMANDS.length} slash entry point(s) checked — ${errors} error(s) — ${status}`);

  if (errors > 0) process.exit(1);
}

main();
