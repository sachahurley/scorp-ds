#!/usr/bin/env bash
# ds-health.sh — Design system health check
#
# Reads .claude/ds-config.json for stack type and runs the appropriate checks.
# Usage:
#   bash scripts/ds-health.sh          — full check
#   bash scripts/ds-health.sh quick    — skip storybook audit
#   bash scripts/ds-health.sh tokens   — token checks only

set -e

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

# ─── READ STACK FROM CONFIG ──────────────────────────────────────────────────

CONFIG_FILE="$PROJECT_ROOT/.claude/ds-config.json"
STACK="flutter"  # default

if [ -f "$CONFIG_FILE" ]; then
  if command -v python3 &>/dev/null; then
    STACK=$(python3 -c "import json; d=json.load(open('$CONFIG_FILE')); print(d.get('stack','flutter'))" 2>/dev/null || echo "flutter")
  fi
fi

info "Stack: $STACK"
echo ""

# ─── 1. SPEC DRIFT ───────────────────────────────────────────────────────────

echo -e "${BOLD}1. Spec Drift${RESET}"

if [ -f "$PROJECT_ROOT/scripts/detect-spec-drift.sh" ]; then
  bash "$PROJECT_ROOT/scripts/detect-spec-drift.sh" 2>&1 | tail -5
  pass "Spec drift check complete"
else
  warn "detect-spec-drift.sh not found"
fi

echo ""

# ─── 2. STATIC ANALYSIS ──────────────────────────────────────────────────────

if [ "$MODE" != "tokens" ]; then
  echo -e "${BOLD}2. Static Analysis${RESET}"

  if [ "$STACK" = "flutter" ]; then
    if command -v flutter &>/dev/null; then
      cd "$PROJECT_ROOT/ds" 2>/dev/null || cd "$PROJECT_ROOT"
      ANALYZE_OUTPUT=$(flutter analyze --no-pub 2>&1)
      if echo "$ANALYZE_OUTPUT" | grep -q "No issues found"; then
        pass "flutter analyze: no issues"
      else
        ISSUE_COUNT=$(echo "$ANALYZE_OUTPUT" | grep -c "error\|warning\|info" || echo "?")
        fail "flutter analyze: $ISSUE_COUNT issue(s) found"
        echo "$ANALYZE_OUTPUT" | grep "error" | head -5
      fi
    else
      warn "flutter not found in PATH"
    fi
  elif [ "$STACK" = "react-ts" ]; then
    if command -v pnpm &>/dev/null; then
      TSC_OUTPUT=$(pnpm type-check 2>&1)
      if echo "$TSC_OUTPUT" | grep -q "error TS"; then
        fail "TypeScript errors found"
        echo "$TSC_OUTPUT" | grep "error TS" | head -5
      else
        pass "TypeScript: no errors"
      fi
    else
      warn "pnpm not found in PATH"
    fi
  fi
  echo ""
fi

# ─── 3. TESTS ────────────────────────────────────────────────────────────────

if [ "$MODE" != "tokens" ]; then
  echo -e "${BOLD}3. Tests${RESET}"

  if [ "$STACK" = "flutter" ]; then
    if command -v flutter &>/dev/null; then
      cd "$PROJECT_ROOT/ds" 2>/dev/null || cd "$PROJECT_ROOT"
      TEST_OUTPUT=$(flutter test --no-pub 2>&1)
      if echo "$TEST_OUTPUT" | grep -q "All tests passed"; then
        pass "flutter test: all passed"
      else
        FAIL_COUNT=$(echo "$TEST_OUTPUT" | grep -c "FAILED" || echo "?")
        fail "flutter test: $FAIL_COUNT failure(s)"
      fi
    else
      warn "flutter not found in PATH"
    fi
  elif [ "$STACK" = "react-ts" ]; then
    if command -v pnpm &>/dev/null; then
      pnpm test 2>&1 | tail -3
    else
      warn "pnpm not found in PATH"
    fi
  fi
  echo ""
fi

# ─── 4. HARDCODED VALUE SCAN ─────────────────────────────────────────────────

echo -e "${BOLD}4. Hardcoded Value Scan${RESET}"

if [ "$STACK" = "flutter" ]; then
  COMPONENTS_DIR="$PROJECT_ROOT/ds/lib/components"
  PRIMITIVES_DIR="$PROJECT_ROOT/ds/lib/primitives"

  if [ -d "$COMPONENTS_DIR" ]; then
    COLOR_HITS=$(grep -rn "Color(0x\|Colors\." "$COMPONENTS_DIR" "$PRIMITIVES_DIR" 2>/dev/null | grep -v "Colors.transparent" | wc -l | tr -d ' ')
    SPACING_HITS=$(grep -rn "EdgeInsets\.[a-z]*([0-9]\|padding: [0-9]\|margin: [0-9]" "$COMPONENTS_DIR" 2>/dev/null | wc -l | tr -d ' ')

    if [ "$COLOR_HITS" -eq 0 ]; then
      pass "No hardcoded colors found"
    else
      fail "$COLOR_HITS hardcoded color(s) found in components/primitives"
    fi

    if [ "$SPACING_HITS" -eq 0 ]; then
      pass "No hardcoded spacing found"
    else
      warn "$SPACING_HITS potential hardcoded spacing value(s) found"
    fi
  else
    warn "components directory not found"
  fi
elif [ "$STACK" = "react-ts" ]; then
  COMPONENTS_DIR="$PROJECT_ROOT/packages/components/src"
  if [ -d "$COMPONENTS_DIR" ]; then
    COLOR_HITS=$(grep -rn "#[0-9a-fA-F]\{3,6\}\|rgb(" "$COMPONENTS_DIR" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$COLOR_HITS" -eq 0 ]; then
      pass "No hardcoded colors found"
    else
      fail "$COLOR_HITS hardcoded color(s) found in components"
    fi
  fi
fi

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
