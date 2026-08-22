#!/usr/bin/env bash
set -euo pipefail

GODOT_VERSION="4.7.2"
GODOT_DIR="$HOME/.local/bin"
TEMPLATE_DIR="$HOME/.local/share/godot/export_templates/${GODOT_VERSION}.stable"

sudo apt-get update -y
sudo apt-get install -y wget unzip python3 libfontconfig1
mkdir -p "$GODOT_DIR" "$TEMPLATE_DIR"

if [ ! -x "$GODOT_DIR/godot" ]; then
  wget -q "https://github.com/godotengine/godot/releases/download/${GODOT_VERSION}-stable/Godot_v${GODOT_VERSION}-stable_linux.x86_64.zip" -O /tmp/godot.zip
  rm -rf /tmp/godot
  mkdir -p /tmp/godot
  unzip -qo /tmp/godot.zip -d /tmp/godot
  mv "/tmp/godot/Godot_v${GODOT_VERSION}-stable_linux.x86_64" "$GODOT_DIR/godot"
  chmod +x "$GODOT_DIR/godot"
fi

if [ ! -f "$TEMPLATE_DIR/web_release.zip" ]; then
  wget -q "https://github.com/godotengine/godot/releases/download/${GODOT_VERSION}-stable/Godot_v${GODOT_VERSION}-stable_export_templates.tpz" -O /tmp/templates.tpz
  rm -rf /tmp/godot-templates
  mkdir -p /tmp/godot-templates
  unzip -qo /tmp/templates.tpz -d /tmp/godot-templates
  cp -R /tmp/godot-templates/templates/. "$TEMPLATE_DIR/"
fi

if ! grep -q 'export PATH="$HOME/.local/bin:$PATH"' "$HOME/.bashrc"; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
fi

export PATH="$GODOT_DIR:$PATH"
godot --version
