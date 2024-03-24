import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { readJson } from './lib/json.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function scan(path, filter, prefix = '') {
  const files = readdirSync(path);
  const subdirs = files.filter((filename) => statSync(join(path, filename)).isDirectory());
  const components = files.filter((file) => filter.test(file));

  return [
    ...components.map((filename) => prefix + filename.split('.')[0]).map((name) => [name, {
      import: `./lib/${name}.js`,
      types: `./lib/${name}.d.ts`,
    }]),
    ...subdirs.map((item) => [item, {
      import: `./lib/${item}/${item}.node.js`,
      types: `./lib/${item}/${item}.node.d.ts`,
    }]),
  ];
}

const source = resolve(__dirname, 'src');
const files = scan(source, /.ts$/);

const packageFilename = resolve(__dirname, 'package.json');
const packageObject = await readJson(packageFilename);

packageObject.exports = {
  './package.json': './package.json',
};

for (const [name, exports] of files) {
  packageObject.exports[`./${name}`] = exports;
}

await writeFile(packageFilename, JSON.stringify(packageObject, null, 2), 'utf-8');
