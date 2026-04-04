#!/usr/bin/env bash
# detect-spec-drift.sh — Find source files changed without a spec update
#
# Compares modification times of source files against their spec counterparts.
# Prints a list of files that have drifted (source newer than spec).
#
# Usage: bash scripts/detect-spec-drift.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SPECS_DIR="$PROJECT_ROOT/docs/specs"
DRIFT_COUNT=0
UPGRADE_COUNT=0

echo ""
echo "── Spec Drift Detection ─────────────────────────────────────────────────"
echo ""

# ─── Read config for source paths ────────────────────────────────────────────

CONFIG_FILE="$PROJECT_ROOT/.claude/ds-config.json"
COMPONENTS_DIR="$PROJECT_ROOT/ds/lib/components"
PRIMITIVES_DIR="$PROJECT_ROOT/ds/lib/primitives"
FOUNDATION_DIR="$PROJECT_ROOT/ds/lib/foundation"
LAB_DIR="$PROJECT_ROOT/ds/lib/lab"

if [ -f "$CONFIG_FILE" ] && command -v python3 &>/dev/null; then
  COMPONENTS_DIR="$PROJECT_ROOT/$(python3 -c "import json; d=json.load(open('$CONFIG_FILE')); print(d.get('paths',{}).get('components','ds/lib/components'))" 2>/dev/null)"
  FOUNDATION_DIR="$PROJECT_ROOT/$(python3 -c "import json; d=json.load(open('$CONFIG_FILE')); print(d.get('paths',{}).get('foundation','ds/lib/foundation'))" 2>/dev/null)"
fi

# ─── Check each source file against its spec ────────────────────────────────

check_dir() {
  local dir="$1"
  local layer="$2"

  if [ ! -d "$dir" ]; then
    return
  fi

  while IFS= read -r -d '' source_file; do
    filename=$(basename "$source_file")
    # Skip barrel files and infrastructure files
    case "$filename" in
      foundation.dart|primitives.dart|components.dart|lab.dart) continue ;;
      color_scheme.dart|theme.dart) continue ;;
      index.ts|index.tsx) continue ;;
    esac

    # Strip extension
    name="${filename%.*}"
    spec_file="$SPECS_DIR/$name.md"

    if [ ! -f "$spec_file" ]; then
      echo "  MISSING SPEC   $layer/$filename"
      DRIFT_COUNT=$((DRIFT_COUNT + 1))
    elif [ "$source_file" -nt "$spec_file" ]; then
      echo "  SPEC OUTDATED  $layer/$filename  (source newer by $(( ($(date -r "$source_file" +%s) - $(date -r "$spec_file" +%s)) / 86400 )) days)"
      DRIFT_COUNT=$((DRIFT_COUNT + 1))
    fi
  done < <(find "$dir" -maxdepth 2 -name "*.dart" -o -name "*.ts" -o -name "*.tsx" 2>/dev/null | grep -v "\.stories\." | grep -v "_test\." | tr '\n' '\0')
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

# Check for specs eligible for status promotion
if [ -d "$SPECS_DIR" ]; then
  while IFS= read -r spec_file; do
    status=$(grep -m1 "^| Status" "$spec_file" 2>/dev/null | awk -F'|' '{print $3}' | tr -d ' `' || echo "")
    name=$(basename "$spec_file" .md)
    source_file=$(find "$COMPONENTS_DIR" "$PRIMITIVES_DIR" "$FOUNDATION_DIR" "$LAB_DIR" -name "${name}.dart" -o -name "${name}.ts" 2>/dev/null | head -1)

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
