/**
 * @scorp-ds/tokens
 *
 * Design token exports for Scorp DS. All tokens defined in tokens.json,
 * resolved and available as TypeScript constants and CSS variable utilities.
 *
 * Usage:
 *   import { tokens, getToken, generateCSSVariables } from '@scorp-ds/tokens';
 *
 * For CSS variables, import the stylesheet in your app entry:
 *   import '@scorp-ds/tokens/styles/tokens.css';
 *
 * For Tailwind integration, add the preset to tailwind.config.js:
 *   presets: [require('@scorp-ds/tokens/tailwind.preset')]
 */

export {
  tokens,
  resolveTokenValue,
  flattenTokens,
  getTokensForTheme,
  generateCSSVariables,
  generateTailwindColors,
  getToken,
  getAllTokens,
} from './lib/token-parser';
