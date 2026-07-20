#!/usr/bin/env node
/*
 * check-links.mjs — 原稿内のローカルリンク / 画像参照が実在するか検査する。
 *
 * 対象:
 *   - Markdown リンク  [text](path)
 *   - 画像            ![alt](path)
 *   - HTML img        <img src="path">
 * 外部リンク(http/https/mailto)とアンカー(#...)は対象外(ネットワーク非依存に保つ)。
 *
 * 1 件でも壊れたローカル参照があれば exit 1(CI で PR を落とすため)。
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

// manuscripts/ 配下の .md を再帰的に集める(Node 18/20/22 いずれでも動くよう自前で走査)
function collectMarkdown(dir) {
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...collectMarkdown(full));
    else if (ent.isFile() && ent.name.endsWith('.md')) out.push(full);
  }
  return out;
}

const files = collectMarkdown('manuscripts').sort();

const LINK = /(?:!?\[[^\]]*\]\(([^)]+)\))|(?:<img[^>]+src=["']([^"']+)["'])/g;
const broken = [];

for (const file of files) {
  const dir = path.dirname(file);
  const content = readFileSync(file, 'utf8');
  let m;
  while ((m = LINK.exec(content)) !== null) {
    const raw = (m[1] ?? m[2] ?? '').trim();
    if (!raw) continue;
    // 外部・アンカー・データURIは対象外
    if (/^(https?:|mailto:|tel:|#|data:)/i.test(raw)) continue;
    const target = raw.split('#')[0].split('?')[0];
    if (!target) continue;
    const resolved = target.startsWith('/')
      ? path.join(process.cwd(), target)
      : path.resolve(dir, target);
    if (!existsSync(resolved)) {
      broken.push({ file, raw });
    }
  }
}

if (broken.length === 0) {
  console.log('✅ ローカルリンク・画像参照は全て解決できました。');
  process.exit(0);
}

console.error(`❌ 壊れたローカル参照: ${broken.length} 件\n`);
for (const b of broken) {
  console.error(`  ${b.file}  ->  ${b.raw}`);
}
process.exit(1);
