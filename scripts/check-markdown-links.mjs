import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ignored = new Set(['.git', 'node_modules', '.agents', '.codex']);
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (ignored.has(entry.name) || entry.isSymbolicLink()) return [];
    const path = resolve(dir, entry.name);
    return entry.isDirectory() ? walk(path) : path.endsWith('.md') ? [path] : [];
  });
}
const files = walk(root);
const broken = [];
let links = 0;
let external = 0;
for (const file of files) {
  const source = readFileSync(file, 'utf8').replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
  const targets = [...source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/gu)].map(m => m[1].trim());
  targets.push(...[...source.matchAll(/^\s{0,3}\[[^\]]+\]:\s*(.+)$/gmu)].map(m => m[1].trim()));
  for (const raw of targets) {
    const target = raw.startsWith('<') ? raw.slice(1, raw.indexOf('>')) : raw.split(/\s/u)[0];
    if (/^(?:https?:|mailto:)/iu.test(target)) { external++; continue; }
    if (target.startsWith('#')) continue;
    const path = target.split(/[?#]/u)[0];
    if (!path) continue;
    links++;
    try {
      const decoded = decodeURIComponent(path);
      const absolute = decoded.startsWith('/') ? resolve(root, '.' + decoded) : resolve(dirname(file), decoded);
      if (!existsSync(absolute) || !(statSync(absolute).isFile() || statSync(absolute).isDirectory())) broken.push(`${file} -> ${target}`);
    } catch { broken.push(`${file} -> ${target}`); }
  }
}
console.log(JSON.stringify({ markdown: files.length, enlaces_locales: links, enlaces_rotos: broken.length, externos_no_comprobados: external, anclas: 'No verificadas, igual que patrón CEX', errores: broken }, null, 2));
if (broken.length) process.exitCode = 1;
