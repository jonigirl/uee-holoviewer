/**
 * bump-version.mjs — UEE Recognition Training v15.0
 * Updates the project version string across all tracked files.
 *
 * Usage:
 *   node tools/bump-version.mjs              — show current version
 *   node tools/bump-version.mjs major        — 15.0.0 → 16.0.0
 *   node tools/bump-version.mjs minor        — 15.0.0 → 15.1.0
 *   node tools/bump-version.mjs patch        — 15.0.0 → 15.0.1
 *   node tools/bump-version.mjs 15.2.0       — set exact version
 */

import { readFileSync, writeFileSync } from 'fs';

// ── Read current version from package.json (single source of truth) ──────────

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const [maj, min, pat] = pkg.version.split('.').map(Number);

const arg = process.argv[2];

if (!arg) {
    console.log(`Current version: v${maj}.${min}  (${pkg.version})`);
    process.exit(0);
}

// ── Compute new version ───────────────────────────────────────────────────────

let newMaj = maj, newMin = min, newPat = pat;

if      (arg === 'major') { newMaj++; newMin = 0; newPat = 0; }
else if (arg === 'minor') { newMin++; newPat = 0; }
else if (arg === 'patch') { newPat++; }
else if (/^\d+\.\d+\.\d+$/.test(arg)) {
    [newMaj, newMin, newPat] = arg.split('.').map(Number);
} else {
    console.error('Error: argument must be major | minor | patch | x.y.z');
    process.exit(1);
}

const oldSemver  = `${maj}.${min}.${pat}`;
const newSemver  = `${newMaj}.${newMin}.${newPat}`;
const oldDisplay = `v${maj}.${min}`;
const newDisplay = `v${newMaj}.${newMin}`;

if (oldSemver === newSemver) {
    console.log(`Already at ${pkg.version} — nothing to do.`);
    process.exit(0);
}

console.log(`Bumping ${oldDisplay} → ${newDisplay}  (${oldSemver} → ${newSemver})\n`);

let updated = 0;

// ── package.json — full semver ────────────────────────────────────────────────

const newPkgContent = readFileSync('package.json', 'utf8')
    .replace(`"version": "${oldSemver}"`, `"version": "${newSemver}"`);
writeFileSync('package.json', newPkgContent);
console.log(`  ✓ package.json`);
updated++;

// ── data/ships.json — _version field (no v prefix) ───────────────────────────

const shipsContent = readFileSync('data/ships.json', 'utf8');
const oldJsonVer = `"_version": "${maj}.${min}"`;
const newJsonVer = `"_version": "${newMaj}.${newMin}"`;
if (shipsContent.includes(oldJsonVer)) {
    writeFileSync('data/ships.json', shipsContent.replace(oldJsonVer, newJsonVer));
    console.log(`  ✓ data/ships.json`);
    updated++;
}

// ── All files using display version (vX.Y) ───────────────────────────────────

const DISPLAY_FILES = [
    'index.html',
    'js/app.js',
    'css/styles.css',
    '_headers',
    'README.md',
    'tools/add-normals.mjs',
    'tools/upload-r2-wrangler.mjs',
    'tools/cross-ref.js',
    'tools/download-ctm.ps1',
    'tools/convert-ctm.ps1',
    'tools/bump-version.mjs',
];

for (const file of DISPLAY_FILES) {
    try {
        const content = readFileSync(file, 'utf8');
        if (content.includes(oldDisplay)) {
            writeFileSync(file, content.replaceAll(oldDisplay, newDisplay));
            console.log(`  ✓ ${file}`);
            updated++;
        }
    } catch (e) {
        console.warn(`  ✗ ${file}  (${e.message})`);
    }
}

console.log(`\nDone. ${updated} file(s) updated.`);
console.log(`Next: git add -A && git commit -m "Bump version to ${newDisplay}"`);
