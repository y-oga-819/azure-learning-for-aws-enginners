// 表紙 SVG(manuscripts/cover.html)を A5・300dpi の PNG に焼く。
// ページ全体ではなく <svg> 要素そのものを撮ることで、ブラウザのビューポート差による
// 下端の隙間(body 透け)を避け、グリッド背景をページ下端まで確実に充填する。
import { chromium } from 'playwright-core';
import path from 'node:path';

const exe =
  process.env.CHROME ||
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fileUrl = 'file://' + path.resolve('manuscripts/cover.html');
const out = path.resolve('assets/cover.png');

const browser = await chromium.launch({
  executablePath: exe,
  args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'],
});
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  await page.setViewportSize({ width: 1748, height: 2480 });
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.evaluateHandle('document.fonts.ready');
  const svg = await page.$('svg');
  if (!svg) throw new Error('svg element not found in cover.html');
  await svg.screenshot({ path: out });
  console.log('assets/cover.png を更新しました。');
} finally {
  await browser.close();
}
