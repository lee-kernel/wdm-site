import { cp, mkdir, rm, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await copyFile(path.join(root, 'index.html'), path.join(output, 'index.html'));
await copyFile(path.join(root, '.nojekyll'), path.join(output, '.nojekyll'));
await cp(path.join(root, 'assets'), path.join(output, 'assets'), {
  recursive: true,
});

console.log('Prepared the marketing site in dist/.');
