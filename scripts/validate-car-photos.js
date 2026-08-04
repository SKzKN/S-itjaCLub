#!/usr/bin/env node
/*
 * T6 photo-standard check for assets/cars-data.js:
 *  - at least 5 photos per car
 *  - at least one interior or engine shot (best-effort proxy for "has interesting
 *    non-exterior coverage" — cars are inconsistent about which one they have)
 *  - images[] and imageViews[] the same length
 *  - every referenced file exists on disk
 *
 * Run: node scripts/validate-car-photos.js
 * Exits non-zero if any car has a warning, so it can be wired into CI.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'assets', 'cars-data.js');
const source = fs.readFileSync(dataPath, 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: dataPath });
const CARS = sandbox.window.CARS;

const INTERIOR_VIEWS = new Set(['interior', 'interior-front', 'interior-rear']);
const ENGINE_VIEWS = new Set(['engine']);
const MIN_PHOTOS = 5;

const rows = [];
let hasWarning = false;

for (const [id, car] of Object.entries(CARS)) {
  const images = car.images || [];
  const views = car.imageViews || [];
  const warnings = [];

  if (images.length < MIN_PHOTOS) {
    warnings.push(`only ${images.length} photo(s), needs >= ${MIN_PHOTOS}`);
  }
  if (images.length !== views.length) {
    warnings.push(`images.length (${images.length}) !== imageViews.length (${views.length})`);
  }
  const hasInterior = views.some((v) => INTERIOR_VIEWS.has(v));
  const hasEngine = views.some((v) => ENGINE_VIEWS.has(v));
  if (!hasInterior && !hasEngine) {
    warnings.push('missing both an interior shot and an engine shot');
  }
  for (const src of images) {
    if (!fs.existsSync(path.join(repoRoot, src))) {
      warnings.push(`missing file on disk: ${src}`);
    }
  }

  rows.push({ id, name: car.name, count: images.length, warnings });
  if (warnings.length) hasWarning = true;
}

rows.sort((a, b) => a.name.localeCompare(b.name));

console.log('Car photo validation');
console.log('='.repeat(60));
for (const row of rows) {
  const status = row.warnings.length ? 'WARN' : 'OK  ';
  console.log(`[${status}] ${row.name} (${row.id}) — ${row.count} photo(s)`);
  for (const w of row.warnings) console.log(`        - ${w}`);
}
console.log('='.repeat(60));
const failCount = rows.filter((r) => r.warnings.length).length;
console.log(`${rows.length} cars checked, ${failCount} with warnings.`);

process.exit(hasWarning ? 1 : 0);
