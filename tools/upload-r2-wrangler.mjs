/**
 * upload-r2-wrangler.mjs — UEE Recognition Training v15.0
 * Upload all GLB models to Cloudflare R2 using Wrangler
 * Usage:
 *   1. npx wrangler login   (first time only — opens browser)
 *   2. node tools/upload-r2-wrangler.mjs
 */

import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const BUCKET     = 'uee-models';
const MODELS_DIR = 'models';

const files = readdirSync(MODELS_DIR).filter(f => f.endsWith('.glb'));
console.log(`Uploading ${files.length} GLB files to R2 bucket: ${BUCKET}\n`);

let ok = 0, failed = 0;
const failures = [];

for (const file of files) {
    process.stdout.write(`  ${file} ... `);
    try {
        execSync(
            `npx wrangler r2 object put "${BUCKET}/${file}" --file "${MODELS_DIR}/${file}" --content-type "model/gltf-binary" --cache-control "public, max-age=31536000, immutable"`,
            { stdio: 'pipe' }
        );
        console.log('OK');
        ok++;
    } catch(e) {
        const msg = e.stderr?.toString().trim().split('\n').pop() || e.message;
        console.log(`FAILED: ${msg}`);
        failures.push(file);
        failed++;
    }
}

console.log(`\nDone. Uploaded: ${ok}  Failed: ${failed}`);
if (failures.length) { console.log('\nFailed files:'); failures.forEach(f => console.log(`  ${f}`)); }
