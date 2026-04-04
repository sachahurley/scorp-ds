/**
 * TOKEN PARSER UTILITY
 * 
 * This file takes your design tokens (from tokens.json) and:
 * 1. Resolves token references like "{color.amber.500}" to actual values
 * 2. Generates CSS custom properties (CSS variables)
 * 3. Provides utilities for Tailwind configuration
 * 
 * Think of this as the "translator" between your design tokens and the CSS/Tailwind system.
 */

import tokensData from '../tokens.json';

// Type definitions for our tokens
type TokenValue = {
  $value: string;
  $type: string;
};

type TokenObject = {
  [key: string]: TokenValue | TokenObject;
};

type Tokens = {
  global: TokenObject;
  light: TokenObject;
  dark: TokenObject;
  $themes?: Array<{
    id: string;
    name: string;
    selectedTokenSets: Record<string, string | undefined>;
  }>;
};

const tokens = tokensData as unknown as Tokens;

/**
 * RESOLVE TOKEN REFERENCES
 * 
 * Converts "{color.amber.500}" to the actual color value "#F59E0B"
 * This function recursively looks up token references until it finds the actual value.
 */
export function resolveTokenValue(value: string, context: TokenObject = tokens.global): string {
  // If it's not a reference (doesn't have curly braces), return as-is
  if (!value.startsWith('{') || !value.endsWith('}')) {
    return value;
  }

  // Extract the path: "{color.amber.500}" becomes "color.amber.500"
  const path = value.slice(1, -1);
  const parts = path.split('.');

  // Navigate through the token object to find the value
  let current: any = context;
  for (const part of parts) {
    if (current[part]) {
      current = current[part];
    } else {
      // If not found in context, try global tokens
      current = tokens.global;
      for (const p of parts) {
        current = current[p];
        if (!current) break;
      }
      break;
    }
  }

  // If we found a token with $value, get its value
  if (current && typeof current === 'object' && '$value' in current) {
    const tokenValue = current.$value;
    // Recursively resolve in case this value is also a reference
    return resolveTokenValue(tokenValue, context);
  }

  // If we couldn't resolve it, return the original value
  return value;
}

/**
 * FLATTEN TOKEN OBJECT
 * 
 * Converts nested tokens into a flat object with dot notation keys
 * Example: { color: { amber: { 500: { $value: "#F59E0B" } } } }
 * Becomes: { "color-amber-500": "#F59E0B" }
 */
export function flattenTokens(
  obj: TokenObject,
  prefix: string = '',
  context: TokenObject = tokens.global
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in obj) {
    // Skip special keys that start with $
    if (key.startsWith('$')) continue;

    const value = obj[key];
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null && '$value' in value) {
      // This is a token with a value - resolve it and add to result
      const tokenValue = value as TokenValue;
      result[newKey] = resolveTokenValue(tokenValue.$value, context);
    } else if (typeof value === 'object' && value !== null) {
      // This is a nested object - recursively flatten it
      Object.assign(result, flattenTokens(value as TokenObject, newKey, context));
    }
  }

  return result;
}

/**
 * GET ALL TOKENS FOR A THEME
 * 
 * Combines global tokens with theme-specific tokens
 * For "light" theme: merges global + light tokens
 * For "dark" theme: merges global + dark tokens
 */
export function getTokensForTheme(themeName: 'light' | 'dark'): Record<string, string> {
  const globalTokens = flattenTokens(tokens.global);
  const themeTokens = flattenTokens(tokens[themeName], '', tokens.global);
  
  return {
    ...globalTokens,
    ...themeTokens,
  };
}

/**
 * GENERATE CSS VARIABLES
 * 
 * Creates CSS custom property strings that can be injected into CSS
 * Returns: "--color-amber-500: #F59E0B; --color-amber-600: #D97706; ..."
 */
export function generateCSSVariables(themeName: 'light' | 'dark'): string {
  const themeTokens = getTokensForTheme(themeName);
  
  return Object.entries(themeTokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
}

/**
 * GENERATE TAILWIND COLORS
 * 
 * Converts color tokens into Tailwind-compatible color configuration
 * Example: { amber: { 50: "#FFFBEB", 100: "#FEF3C7", ... } }
 */
export function generateTailwindColors(): Record<string, any> {
  const globalTokens = flattenTokens(tokens.global);
  const colors: Record<string, any> = {};

  for (const [key, value] of Object.entries(globalTokens)) {
    // Only process color tokens
    if (!key.startsWith('color-')) continue;

    // Remove 'color-' prefix: "color-amber-500" becomes "amber-500"
    const colorPath = key.replace('color-', '');
    const parts = colorPath.split('-');

    // Build nested color object
    let current = colors;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    // Set the final value
    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  }

  return colors;
}

/**
 * GET TOKEN BY NAME
 * 
 * Helper to look up a specific token value
 * Usage: getToken('color-amber-500') returns "#F59E0B"
 */
export function getToken(tokenName: string, themeName: 'light' | 'dark' = 'light'): string | undefined {
  const themeTokens = getTokensForTheme(themeName);
  return themeTokens[tokenName];
}

/**
 * GET ALL TOKENS (RAW)
 * 
 * Returns the raw token data structure
 */
export function getAllTokens() {
  return tokens;
}

// Export the raw tokens for direct access if needed
export { tokens };
