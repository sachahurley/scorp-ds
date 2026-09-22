#!/usr/bin/env bash
# ds-health.sh — Design system health check
#
# Scorp DS is a React/TypeScript/Tailwind repo. This script assumes that and
# nothing else: there is no stack branching and no default stack. If
# ds-config.json says anything other than react-ts, that is a real problem and
# the script says so rather than quietly running the wrong checks.
#
# Usage:
#   bash scripts/ds-health.sh          — full check
#   bash scripts/ds-health.sh quick    — skip tests
#   bash scripts/ds-health.sh tokens   — token/hardcoding checks only

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# ─── COLORS ──────────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
RESET='\033[0m'

pass() { echo -e "  ${GREEN}✓${RESET} $1"; }
fail() { echo -e "  ${RED}✗${RESET} $1"; FAILURES=$((FAILURES + 1)); }
warn() { echo -e "  ${YELLOW}⚠${RESET} $1"; }
info() { echo -e "  ${BLUE}→${RESET} $1"; }

FAILURES=0
MODE="${1:-full}"

echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  DS Health Check${RESET}  (mode: $MODE)"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

# ─── CONFIG ──────────────────────────────────────────────────────────────────

CONFIG_FILE="$PROJECT_ROOT/.claude/ds-config.json"

if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "  ${RED}ERROR${RESET}: cannot read $CONFIG_FILE" >&2
  exit 1
fi

if ! command -v python3 &>/dev/null; then
  echo -e "  ${RED}ERROR${RESET}: python3 is required to parse ds-config.json" >&2
  exit 1
fi

cfg() {
  python3 -c "
import json, sys
d = json.load(open('$CONFIG_FILE'))
cur = d
for k in '$1'.split('.'):
    cur = cur.get(k) if isinstance(cur, dict) else None
    if cur is None:
        sys.stderr.write('ERROR: $1 missing from ds-config.json\n'); sys.exit(1)
print(cur)
"
}

STACK="$(cfg stack)" || exit 1
if [ "$STACK" != "react-ts" ]; then
  echo -e "  ${RED}ERROR${RESET}: ds-config.json stack is '$STACK', expected 'react-ts'." >&2
  echo "  This script only knows how to check a React/TypeScript repo." >&2
  exit 1
fi

COMPONENTS_DIR="$PROJECT_ROOT/$(cfg paths.components)" || exit 1
PRIMITIVES_DIR="$PROJECT_ROOT/$(cfg paths.primitives)" || exit 1

if ! command -v npm &>/dev/null; then
  echo -e "  ${RED}ERROR${RESET}: npm not found in PATH (this repo uses npm workspaces)." >&2
  exit 1
fi

info "Stack: $STACK"
echo ""

# ─── 1. SPEC DRIFT ───────────────────────────────────────────────────────────

echo -e "${BOLD}1. Spec Drift${RESET}"

if [ -f "$PROJECT_ROOT/scripts/detect-spec-drift.sh" ]; then
  bash "$PROJECT_ROOT/scripts/detect-spec-drift.sh" 2>&1 | grep -E "MISSING SPEC|SPEC OUTDATED|SKIPPED|✓|⚠" | head -10
  pass "Spec drift check complete"
else
  warn "detect-spec-drift.sh not found"
fi

echo ""

# ─── 2. LINT ─────────────────────────────────────────────────────────────────

if [ "$MODE" != "tokens" ]; then
  echo -e "${BOLD}2. Lint${RESET}"
  if LINT_OUT=$(cd "$PROJECT_ROOT" && npm run lint 2>&1); then
    pass "ESLint: no problems"
  else
    fail "ESLint reported problems"
    echo "$LINT_OUT" | grep -E "error|warning" | head -5
  fi
  echo ""
fi

# ─── 3. TYPE CHECK ───────────────────────────────────────────────────────────

if [ "$MODE" != "tokens" ]; then
  echo -e "${BOLD}3. Type Check${RESET}"

  # packages/site resolves @scorp-ds/components to its built dist, so a
  # type-check on a clean tree fails with "Cannot find module" unless the
  # components package has been built at least once.
  if [ ! -d "$PROJECT_ROOT/packages/components/dist" ]; then
    info "Building components first (packages/site type-checks against its dist)"
    (cd "$PROJECT_ROOT" && npm run build:components >/dev/null 2>&1) || warn "build:components failed"
  fi

  TSC_OUTPUT=$(cd "$PROJECT_ROOT" && npm run type-check 2>&1)
  if echo "$TSC_OUTPUT" | grep -q "error TS"; then
    fail "TypeScript errors found"
    echo "$TSC_OUTPUT" | grep "error TS" | head -5
  else
    pass "TypeScript: no errors"
  fi
  echo ""
fi

# ─── 4. TESTS ────────────────────────────────────────────────────────────────

if [ "$MODE" = "full" ]; then
  echo -e "${BOLD}4. Tests${RESET}"
  TEST_OUT=$(cd "$PROJECT_ROOT" && npm test 2>&1)
  echo "$TEST_OUT" | grep -E "Test Files|Tests " | head -4
  if echo "$TEST_OUT" | grep -qE "Test Files.*failed"; then
    fail "Tests reported failure(s)"
  else
    pass "All tests passed"
  fi
  echo ""
fi

# ─── 5. HARDCODED VALUE SCAN ─────────────────────────────────────────────────
#
# Mirrors the "No Hardcoding" and "What NOT to Do" rules in CLAUDE.md. These
# are greps, not a parser: they are a fast signal, and the custom ESLint rules
# are the enforcing version.

echo -e "${BOLD}5. Hardcoded Value Scan${RESET}"

scan() {
  local label="$1" pattern="$2"
  local hits
  hits=$(grep -rnE "$pattern" "$COMPONENTS_DIR" "$PRIMITIVES_DIR" 2>/dev/null \
           | grep -v "/__tests__/" | wc -l | tr -d ' ')
  if [ "$hits" -eq 0 ]; then
    pass "$label: none"
  else
    fail "$label: $hits"
    grep -rnE "$pattern" "$COMPONENTS_DIR" "$PRIMITIVES_DIR" 2>/dev/null \
      | grep -v "/__tests__/" | head -3 | sed 's|^|      |'
  fi
}

scan "Raw hex colors"        '#[0-9a-fA-F]{3,8}\b'
scan "rgb()/hsl() colors"    '\b(rgba?|hsla?)\('
scan "Rounded corners"       'rounded-(sm|md|lg|xl|2xl|3xl|full)'
scan "Raw color scales"      '\b(bg|text|border|ring|fill|stroke|from|to|via)-(amber|sepia|green|blue|purple|red)-[0-9]{2,3}'
scan "Sans-serif fonts"      '\bfont-(sans|serif)\b'
scan "Forbidden package"     '@sachahurley/scorpion-ui'

echo ""

# ─── SUMMARY ─────────────────────────────────────────────────────────────────

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

if [ "$FAILURES" -eq 0 ]; then
  echo -e "${GREEN}${BOLD}  All checks passed${RESET}"
else
  echo -e "${RED}${BOLD}  $FAILURES check(s) failed${RESET}"
fi

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

exit $FAILURES
