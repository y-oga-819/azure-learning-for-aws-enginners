#!/usr/bin/env bash
# 表紙のラスタライズ: manuscripts/cover.html を A5・300dpi の PNG に焼いて
# assets/cover.png を更新する。cover.html(SVG)を編集したら実行する。
#
# CHROME 環境変数で Chromium 実行ファイルを指定できる(未指定なら数か所を探索)。
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in \
    /opt/pw-browsers/chromium-*/chrome-linux/chrome \
    "$(command -v chromium || true)" \
    "$(command -v google-chrome || true)"; do
    if [ -x "$c" ]; then CHROME="$c"; break; fi
  done
fi
if [ -z "$CHROME" ] || [ ! -x "$CHROME" ]; then
  echo "Chromium が見つかりません。CHROME=/path/to/chrome を指定してください。" >&2
  exit 1
fi

mkdir -p assets
"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=1748,2480 --default-background-color=00000000 \
  --screenshot=assets/cover.png "file://$PWD/manuscripts/cover.html"

echo "assets/cover.png を更新しました。"
