#!/usr/bin/env bash
# detect-spec-drift.sh — Find source files changed without a spec update
#
# Compares modification times of source files against their spec counterparts
# and prints anything that has drifted (source newer than spec, or no spec).
#
# NOTE: mtime is not a reliable drift signal across environments — a fresh
# clone or worktree checkout stamps every file with the same time, so drift
# reads as clean. Replacing this with a hash of each component's public API
# surface is tracked as part of the contracts work.
#
# Usage: bash scripts/detect-spec-drift.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SPECS_DIR="$PROJECT_ROOT/docs/specs"
DRIFT_COUNT=0
UPGRADE_COUNT=0

echo ""
echo "── Spec Drift Detection ─────────────────────────────────────────────────"
echo ""

# ─── Read config for source paths ────────────────────────────────────────────
#
# There are no fallback paths on purpose. A wrong-but-plausible default sends
# the script looking at a directory that does not exist, which reports "no
# drift" for a layer it never scanned. Fail loudly instead.

CONFIG_FILE="$PROJECT_ROOT/.claude/ds-config.json"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "  ERROR: cannot read $CONFIG_FILE" >&2
  echo "  This script takes every source path from that file." >&2
  exit 1
fi

if ! command -v python3 &>/dev/null; then
  echo "  ERROR: python3 is required to parse $CONFIG_FILE" >&2
  exit 1
fi

read_path() {
  local key="$1"
  python3 -c "
import json, sys
d = json.load(open('$CONFIG_FILE'))
v = d.get('paths', {}).get('$key')
if not v:
    sys.stderr.write('ERROR: paths.$key missing from ds-config.json\n')
    sys.exit(1)
print(v)
"
}

COMPONENTS_DIR="$PROJECT_ROOT/$(read_path components)"
PRIMITIVES_DIR="$PROJECT_ROOT/$(read_path primitives)"
FOUNDATION_DIR="$PROJECT_ROOT/$(read_path foundation)"
LAB_DIR="$PROJECT_ROOT/$(read_path lab)"

# ─── Check each source file against its spec ────────────────────────────────

check_dir() {
  local dir="$1"
  local layer="$2"

  # A configured layer that does not exist is worth saying out loud — silence
  # here is what hid the primitives layer being skipped entirely.
  if [ ! -d "$dir" ]; then
    echo "  SKIPPED        $layer (no such directory: ${dir#$PROJECT_ROOT/})"
    return
  fi

  while IFS= read -r -d '' source_file; do
    filename=$(basename "$source_file")
    case "$filename" in
      index.ts|index.tsx) continue ;;
    esac

    name="${filename%.*}"
    spec_file="$SPECS_DIR/$name.md"

    if [ ! -f "$spec_file" ]; then
      echo "  MISSING SPEC   $layer/$filename"
      DRIFT_COUNT=$((DRIFT_COUNT + 1))
    elif [ "$source_file" -nt "$spec_file" ]; then
      days=$(( ( $(date -r "$source_file" +%s) - $(date -r "$spec_file" +%s) ) / 86400 ))
      echo "  SPEC OUTDATED  $layer/$filename  (source newer by $days days)"
      DRIFT_COUNT=$((DRIFT_COUNT + 1))
    fi
  done < <(find "$dir" -maxdepth 2 \( -name "*.ts" -o -name "*.tsx" \) \
             ! -name "*.stories.*" ! -name "*.test.*" -print0 2>/dev/null)
}

check_dir "$FOUNDATION_DIR" "foundation"
check_dir "$PRIMITIVES_DIR" "primitives"
check_dir "$COMPONENTS_DIR" "components"
check_dir "$LAB_DIR" "lab"

# ─── Summary ─────────────────────────────────────────────────────────────────

echo ""
if [ "$DRIFT_COUNT" -eq 0 ]; then
  echo "  ✓ No spec drift detected — all specs are up to date."
else
  echo "  ⚠ $DRIFT_COUNT file(s) with spec drift detected."
  echo "    Run /update-spec <name> to update each spec."
fi

echo ""
echo "── Status Upgrade Opportunities ─────────────────────────────────────────"
echo ""

# Only scan the layers that actually exist, so `find` does not abort on a
# missing directory and take the whole loop with it.
SEARCH_DIRS=()
for d in "$COMPONENTS_DIR" "$PRIMITIVES_DIR" "$FOUNDATION_DIR" "$LAB_DIR"; do
  [ -d "$d" ] && SEARCH_DIRS+=("$d")
done

if [ -d "$SPECS_DIR" ] && [ ${#SEARCH_DIRS[@]} -gt 0 ]; then
  while IFS= read -r spec_file; do
    status=$(grep -m1 "^| Status" "$spec_file" 2>/dev/null | awk -F'|' '{print $3}' | tr -d ' `' || echo "")
    name=$(basename "$spec_file" .md)
    source_file=$(find "${SEARCH_DIRS[@]}" \
                    \( -name "${name}.ts" -o -name "${name}.tsx" \) 2>/dev/null | head -1)

    if [ "$status" = "draft" ] && [ -n "$source_file" ]; then
      echo "  UPGRADEABLE  $name (draft → design-complete candidate)"
      UPGRADE_COUNT=$((UPGRADE_COUNT + 1))
    fi
  done < <(find "$SPECS_DIR" -name "*.md" ! -name "CHANGELOG.md" 2>/dev/null)
fi

if [ "$UPGRADE_COUNT" -gt 0 ]; then
  echo ""
  echo "  $UPGRADE_COUNT spec(s) may be eligible for status promotion."
  echo "  Run /update-spec <name> to evaluate each one."
else
  echo "  No status upgrades available."
fi

echo ""
