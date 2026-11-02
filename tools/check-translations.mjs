#!/usr/bin/env node
/**
 * Verifies every locale file has exactly the same keys as the base locale
 * and no empty values. Usage: node tools/check-translations.mjs [messagesDir] [baseLocale]
 * Exits 1 on any problem (wire it into CI as `i18n:check`).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2] ?? 'locales';
const base = process.argv[3] ?? 'en';

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) =>
    value !== null && typeof value === 'object'
      ? flatten(value, `${prefix}${key}.`)
      : [[`${prefix}${key}`, value]],
  );

const load = (file) => new Map(flatten(JSON.parse(readFileSync(join(dir, file), 'utf8'))));

const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
const baseFile = `${base}.json`;

if (!files.includes(baseFile)) {
  console.error(`Base locale file not found: ${join(dir, baseFile)}`);
  process.exit(1);
}

const baseMap = load(baseFile);
let failed = false;

const report = (file, label, keys) => {
  if (keys.length === 0) return;
  failed = true;
  console.error(`\n[${file}] ${label} (${keys.length}):`);
  for (const key of keys) console.error(`  - ${key}`);
};

for (const file of files) {
  const map = load(file);
  if (file !== baseFile) {
    report(file, 'missing keys', [...baseMap.keys()].filter((k) => !map.has(k)));
    report(file, 'extra keys', [...map.keys()].filter((k) => !baseMap.has(k)));
  }
  report(
    file,
    'empty values',
    [...map.entries()].filter(([, v]) => typeof v === 'string' && v.trim() === '').map(([k]) => k),
  );
}

if (failed) {
  console.error('\ni18n check failed.');
  process.exit(1);
}
console.log(`i18n check passed (${files.length} locale files, ${baseMap.size} keys).`);
