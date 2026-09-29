#!/bin/sh
# Writes the SPA's runtime config.json from container environment variables, which Container
# Apps sets per environment. Keys match src/app/app-config.ts. APP_VERSION is baked into the
# image at build time.
set -eu

json_escape() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

target=/usr/share/nginx/html/config.json
printf '{"environment":"%s","apiBaseUrl":"%s","version":"%s"}\n' \
  "$(json_escape "${APP_ENVIRONMENT:-local}")" \
  "$(json_escape "${API_BASE_URL:-}")" \
  "$(json_escape "${APP_VERSION:-dev}")" > "$target"

echo "runtime config: $(cat "$target")"
