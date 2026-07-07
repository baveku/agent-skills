#!/usr/bin/env node
/**
 * validate-plugin-manifests.js
 *
 * Checks host-specific plugin manifests and install views that are not covered
 * by the skill anatomy validator.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readJson(relativePath, errors) {
  const filePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing ${relativePath}`);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    errors.push(`Invalid JSON in ${relativePath}: ${err.message}`);
    return null;
  }
}

function expectPathInsideRoot(value, owner, errors) {
  if (typeof value !== 'string' || !value.startsWith('./')) {
    errors.push(`${owner} must be a ./-prefixed relative path`);
    return;
  }

  const resolved = path.resolve(ROOT, value);
  if (!resolved.startsWith(ROOT)) {
    errors.push(`${owner} must stay inside the repository root`);
  }
  if (!fs.existsSync(resolved)) {
    errors.push(`${owner} points to missing path: ${value}`);
  }
}

function validateCodex(errors) {
  const manifest = readJson('.codex-plugin/plugin.json', errors);
  if (!manifest) return;

  for (const field of ['name', 'version', 'description', 'skills', 'interface']) {
    if (!manifest[field]) errors.push(`.codex-plugin/plugin.json missing required field: ${field}`);
  }

  expectPathInsideRoot(manifest.skills, 'Codex skills path', errors);

  if (manifest.agents) {
    errors.push('Codex plugin manifest must not use an agents field; Codex custom agents live in .codex/agents/*.toml');
  }
}

function validateMarketplace(errors) {
  const marketplace = readJson('.agents/plugins/marketplace.json', errors);
  if (!marketplace) return;

  if (!marketplace.name) errors.push('.agents/plugins/marketplace.json missing name');
  if (!marketplace.interface?.displayName) {
    errors.push('.agents/plugins/marketplace.json missing interface.displayName');
  }
  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
    errors.push('.agents/plugins/marketplace.json must include plugins[]');
    return;
  }

  for (const plugin of marketplace.plugins) {
    if (!plugin.name) errors.push('Marketplace plugin entry missing name');
    const sourcePath = typeof plugin.source === 'string' ? plugin.source : plugin.source?.path;
    expectPathInsideRoot(sourcePath, `Marketplace source for ${plugin.name ?? '(unnamed plugin)'}`, errors);
    if (!plugin.policy?.installation) errors.push(`Marketplace plugin ${plugin.name} missing policy.installation`);
    if (!plugin.policy?.authentication) errors.push(`Marketplace plugin ${plugin.name} missing policy.authentication`);
    if (!plugin.category) errors.push(`Marketplace plugin ${plugin.name} missing category`);
  }
}

function validateSkillView(viewDir, errors) {
  const abs = path.join(ROOT, viewDir);
  if (!fs.existsSync(abs)) {
    errors.push(`Missing ${viewDir}`);
    return;
  }

  for (const entry of fs.readdirSync(abs)) {
    const entryPath = path.join(abs, entry);
    const stat = fs.lstatSync(entryPath);
    if (!stat.isDirectory() && !stat.isSymbolicLink()) {
      errors.push(`${path.join(viewDir, entry)} must be a skill directory or Git symlink`);
      continue;
    }

    const skillPath = path.join(entryPath, 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      errors.push(`${path.join(viewDir, entry)} does not resolve to SKILL.md`);
    }
  }
}

function main() {
  const errors = [];

  validateCodex(errors);
  validateMarketplace(errors);
  validateSkillView('claude/skills', errors);
  validateSkillView('codex/skills', errors);

  if (errors.length) {
    console.log('Plugin manifest validation failed:');
    for (const error of errors) console.log(`  ERROR: ${error}`);
    process.exit(1);
  }

  console.log('Plugin manifests and install skill views are valid.');
}

main();
