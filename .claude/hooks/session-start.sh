#!/bin/bash
# ローカルの Claude Code と Claude Code on the web の両方で動く SessionStart フック。
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

# 依存関係（node_modules がない、または package.json が更新された場合のみ）
if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
  npm install --no-audit --no-fund
fi

# クラウド環境では .env が存在しないため、ダミー値のサンプルから作成する。
# ローカルの本物の .env は上書きしない。
if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ] && [ ! -f .env ]; then
  cp .env.example .env
fi
