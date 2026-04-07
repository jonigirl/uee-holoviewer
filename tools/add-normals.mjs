/**
 * add-normals.mjs — UEE Recognition Training v15.0
 * Computes and adds smooth vertex normals to GLB files that are missing them.
 * Handles both plain and Draco-compressed GLBs.
 * Usage: node tools/add-normals.mjs
 */

import { readdir } from 'fs/promises';
import { join } from 'path';
import { NodeIO } from '@gltf-transform/core';
import { normals, weld, draco } from '@gltf-transform/functions';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { existsSync, readFileSync } from 'fs';
import draco3d from 'draco3d';

const MODELS_DIR = 'models';

function hasNormals(glbPath) {
    const buf = readFileSync(glbPath);
    return buf.toString('utf8').includes('NORMAL');
}

const decoderModule = await draco3d.createDecoderModule();
const encoderModule = await draco3d.createEncoderModule();

const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
        'draco3d.decoder': decoderModule,
        'draco3d.encoder': encoderModule,
    });

const files = existsSync(MODELS_DIR)
    ? (await readdir(MODELS_DIR)).filter(f => f.endsWith('.glb'))
    : [];

const toProcess = files.filter(f => !hasNormals(join(MODELS_DIR, f)));
console.log(`Found ${toProcess.length} GLBs missing normals.\n`);

let ok = 0, fail = 0;
const failures = [];

for (const file of toProcess) {
    const path = join(MODELS_DIR, file);
    process.stdout.write(`Processing: ${file} ... `);
    try {
        const document = await io.read(path);
        await document.transform(weld({ tolerance: 0.0001 }), normals(), draco());
        await io.write(path, document);
        console.log('OK');
        ok++;
    } catch (e) {
        console.log(`FAILED: ${e.message}`);
        failures.push({ file, error: e.message });
        fail++;
    }
}

console.log(`\nDone. OK: ${ok}  Failed: ${fail}`);
if (failures.length) {
    console.log('\nFailed files:');
    failures.forEach(f => console.log(`  ${f.file}: ${f.error}`));
}
