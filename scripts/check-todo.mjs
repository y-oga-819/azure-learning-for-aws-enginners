#!/usr/bin/env node
/*
 * check-todo.mjs — 原稿に残る「要検証」マーカーを集計してレポートする。
 *
 * CLAUDE.md のルールにより、未検証の数値・手順には
 *   <!-- 要検証 --> / <!-- 要検証: 公式Doc確認 -->
 * を付ける。発行前に 0 件にするのが運用ゴール。
 *
 * 既定では「レポートのみ(exit 0)」。--strict を付けると 1 件でも残っていれば
 * 失敗(exit 1)するので、リリース用ワークフローで使う。
 */
import { readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';

const strict = process.argv.includes('--strict');
const MARKER = /<!--\s*要検証/;

const files = [];
for await (const f of glob('manuscripts/**/*.md')) files.push(f);
files.sort();

let total = 0;
const perFile = [];

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const hits = [];
  lines.forEach((line, i) => {
    if (MARKER.test(line)) hits.push({ line: i + 1, text: line.trim() });
  });
  if (hits.length) {
    perFile.push({ file, hits });
    total += hits.length;
  }
}

if (total === 0) {
  console.log('✅ 「要検証」マーカーは残っていません。');
  process.exit(0);
}

console.log(`⚠️  「要検証」マーカー: 合計 ${total} 件\n`);
for (const { file, hits } of perFile) {
  console.log(`  ${file}  (${hits.length}件)`);
  for (const h of hits) {
    console.log(`    L${h.line}: ${h.text.slice(0, 100)}`);
  }
}
console.log('\n発行前に全て解消してください(未検証のままマージしない運用)。');

process.exit(strict ? 1 : 0);
