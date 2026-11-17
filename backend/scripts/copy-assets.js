// After `tsc`, copies the non-TypeScript files of src/ (OpenAPI .yaml) into dist/.
const fs = require('node:fs');
const path = require('node:path');

const src = path.resolve(__dirname, '../src');
const dist = path.resolve(__dirname, '../dist');
fs.cpSync(src, dist, { recursive: true, filter: (file) => fs.statSync(file).isDirectory() || file.endsWith('.yaml') });
