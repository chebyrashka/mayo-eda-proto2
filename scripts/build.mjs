import { cp, mkdir } from 'node:fs/promises';

const projectRoot = new URL('../', import.meta.url);
await mkdir(new URL('dist/', projectRoot), { recursive: true });
await cp(new URL('public/', projectRoot), new URL('dist/', projectRoot), { recursive: true });
console.log('Static prototype built in dist/');
