/**
 * THEME PROVIDER
 * 
 * Manages light/dark theme switching using next-themes
 * This wraps your app and provides theme context to all components
 */

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      // Dark is the system's canonical theme post-merge (the portfolio identity);
      // light remains available as a secondary theme.
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
