#!/usr/bin/env bash
# 表紙のラスタライズ: manuscripts/cover.html の <svg> を A5・300dpi の PNG に焼いて
# assets/cover.png を更新する。cover.html(SVG)を編集したら実行する。
#
# Playwright(playwright-core)で SVG 要素そのものをスクリーンショットする。
# ページ全体ではなく要素を撮ることで、ブラウザのビューポート差による下端の隙間を避け、
# グリッド背景をページ下端まで隙間なく充填する。
# CHROME 環境変数で Chromium 実行ファイルを指定できる。
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/rasterize-cover.mjs
