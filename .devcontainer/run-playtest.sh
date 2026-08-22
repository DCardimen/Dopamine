#!/usr/bin/env bash
set -u

export PATH="$HOME/.local/bin:$PATH"
rm -rf web
mkdir -p web

BUILD_LOG="web/build.log"

echo "[Dopamine] Exporting Godot web build..."
if godot --headless --path . --export-release Web web/index.html >"$BUILD_LOG" 2>&1; then
  touch web/.nojekyll
  echo "[Dopamine] Export succeeded."
else
  echo "[Dopamine] Export failed. Building browser error report..."
  cp "$BUILD_LOG" /tmp/dopamine-build.log 2>/dev/null || true
  python3 - <<'PY'
from pathlib import Path
import html

log_path = Path("web/build.log")
log = log_path.read_text(errors="replace") if log_path.exists() else "No build log was produced."
page = f'''<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dopamine build error</title>
<style>
body{{font-family:system-ui,sans-serif;max-width:1000px;margin:24px auto;padding:0 18px;background:#111827;color:#f3f4f6}}
pre{{white-space:pre-wrap;word-break:break-word;background:#030712;padding:16px;border-radius:10px;overflow:auto;font-size:13px;line-height:1.45}}
h1{{color:#fbbf24}} code{{color:#bfdbfe}}
</style>
</head>
<body>
<h1>Dopamine did not export successfully</h1>
<p>The Codespace is working. The exact Godot export log is below.</p>
<pre>{html.escape(log)}</pre>
<p>After the repo is fixed, run <code>git pull && bash .devcontainer/run-playtest.sh</code> and refresh this page.</p>
</body>
</html>'''
Path("web/index.html").write_text(page)
PY
fi

echo "[Dopamine] Restarting preview server on port 8000..."
pkill -f "python3 -m http.server 8000" 2>/dev/null || true
nohup python3 -m http.server 8000 --directory web >/tmp/dopamine-server.log 2>&1 &
echo "[Dopamine] Playtest server ready: port 8000"
