#!/usr/bin/env bash
set -u

export PATH="$HOME/.local/bin:$PATH"
rm -rf web
mkdir -p web

BUILD_LOG="web/build.log"

if godot --headless --path . --export-release Web web/index.html >"$BUILD_LOG" 2>&1; then
  touch web/.nojekyll
else
  cp "$BUILD_LOG" /tmp/dopamine-build.log 2>/dev/null || true
  cat > web/index.html <<'EOF'
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dopamine build error</title>
<style>
body{font-family:system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;background:#111827;color:#f3f4f6}pre{white-space:pre-wrap;background:#030712;padding:16px;border-radius:10px;overflow:auto}h1{color:#fbbf24}
</style>
</head>
<body>
<h1>Dopamine did not export successfully</h1>
<p>The Codespace is working. Open <code>/tmp/dopamine-build.log</code> in VS Code to see the Godot error, fix it, then run:</p>
<pre>bash .devcontainer/run-playtest.sh</pre>
</body>
</html>
EOF
fi

pkill -f "python3 -m http.server 8000" 2>/dev/null || true
nohup python3 -m http.server 8000 --directory web >/tmp/dopamine-server.log 2>&1 &
echo "Dopamine playtest server: port 8000"
