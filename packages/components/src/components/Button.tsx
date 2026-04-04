/**
 * BUTTON COMPONENT
 * 
 * Reusable button component with multiple variants and sizes
 * Built entirely from design tokens defined in tokens.json
 * 
 * VARIANTS:
 * - primary: Main call-to-action button (has tokens in light/dark themes)
 * - secondary: Secondary actions (has tokens in light/dark themes)
 * - ghost: ⚠️ ASSUMPTION - Transparent background, visible text
 * - link: ⚠️ ASSUMPTION - Text-only button with underline on hover
 * - outline: ⚠️ ASSUMPTION - Transparent with border
 * - destructive: ⚠️ ASSUMPTION - Red/error colored for dangerous actions
 * 
 * SIZES: All defined in tokens.json
 * - small: 32px height
 * - medium: 40px height (default)
 * - large: 48px height
 */

import { forwardRef, type ButtonHTMLAttributes } from "react";

// Define the props interface for the Button component
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link" | "outline" | "destructive" | "icon";
  size?: "small" | "medium" | "large" | "icon";
  disabled?: boolean;
  // Icon support - can be any React element (TUI: typically TuiIcon or Unicode characters)
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

/**
 * Button Component
 * 
 * @param variant - Button style variant (default: "primary")
 * @param size - Button size (default: "medium")
 * @param disabled - Whether button is disabled
 * @param className - Additional CSS classes to apply
 * @param children - Button content (text, icons, etc.)
 * @param iconLeft - Icon element to display on the left side of text
 * @param iconRight - Icon element to display on the right side of text
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      variant = "primary", 
      size = "medium", 
      disabled = false, 
      className = "", 
      children,
      iconLeft,
      iconRight,
      ...props 
    },
    ref
  ) => {
    // BASE STYLES - Applied to all buttons
    // Uses tokens: font.size.sm (14px)
    // Border radius is size-specific (see sizeStyles)
    const baseStyles = `
      inline-flex items-center justify-center
      font-mono text-sm
      transition-colors duration-200
      cursor-pointer
      disabled:cursor-not-allowed disabled:opacity-50
      focus:outline-none
    `;

    // Helper function to check if button is icon-only (no text label)
    // Icon-only buttons should be square (no padding) regardless of variant
    const isIconOnly = () => {
      // If variant is "icon", it's always icon-only
      if (variant === "icon") return true;
      
      // If no children, it's not icon-only (empty button)
      if (!children) return false;
      
      // Check if children is a single React element (likely an icon)
      // If children is a string or number, it's text (not icon-only)
      if (typeof children === 'string' || typeof children === 'number') return false;
      
      // If children is an object with a 'type' property, it's likely a React element (icon)
      if (typeof children === 'object' && children !== null && 'type' in children) {
        // Check if it's a React element (not an array or fragment)
        return typeof (children as any).type !== 'undefined';
      }
      
      // If children is an array, check if all elements are React elements (icons)
      if (Array.isArray(children)) {
        return children.every(child => 
          typeof child === 'object' && child !== null && 'type' in child
        );
      }
      
      return false;
    };

    // SIZE STYLES - All values from tokens.json
    // Small: 32px height, 16px horizontal padding, 6px corner radius
    // Medium: 40px height, 20px horizontal padding, 8px corner radius
    // Large: 48px height, 24px horizontal padding, 12px corner radius (rounded-button)
    // Icon-only buttons: Square buttons matching size dimensions (no padding, uses flex centering)
    // Function to get size styles based on variant and whether button is icon-only
    const getSizeStyles = () => {
      const iconOnly = isIconOnly();
      
      // For icon-only buttons (any variant), use square dimensions matching the size
      // TUI: all corners sharp (rounded-none)
      if (iconOnly || variant === "icon") {
        switch (size) {
          case "small":
            return "h-8 w-8 rounded-none";
          case "large":
            return "h-12 w-12 rounded-none";
          case "icon":
            return "h-10 w-10 rounded-none";
          default: // medium
            return "h-10 w-10 rounded-none";
        }
      }
      
      // For regular buttons with labels, use standard size styles
      // TUI: all corners sharp (rounded-none)
      switch (size) {
        case "small":
          return "h-8 px-4 py-1.5 rounded-none";
        case "large":
          return "h-12 px-6 py-3.5 rounded-none";
        case "icon":
          return "h-10 w-10 rounded-none";
        default: // medium
          return "h-10 px-5 py-2.5 rounded-none";
      }
    };

    // VARIANT STYLES - Color combinations for each variant using SEMANTIC TOKENS
    // ✓ = Has tokens in tokens.json
    // ⚠️ = Assumption made, needs token definition
    const variantStyles = {
      // ✓ PRIMARY - Uses semantic primary tokens (resolves to amber)
      // Light: primary-400 bg → primary-500 hover | black text (same as dark)
      // Dark: primary-400 bg → primary-500 hover | black text
      // Focus: 2px ring with 2px offset (matches page background: sepia-50 light / sepia-1000 dark)
      // Ring color set via inline style to ensure consistency
      primary: `
        bg-primary-400 hover:bg-primary-500 active:bg-primary-600 text-black
        dark:bg-primary-400 dark:hover:bg-primary-500 dark:active:bg-primary-600 dark:text-black
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
      `,

      // ✓ SECONDARY - Uses semantic secondary tokens (resolves to sepia)
      // Light: secondary-700 bg → secondary-600 hover | secondary-50 text (same as dark)
      // Dark: secondary-700 bg → secondary-600 hover | secondary-50 text
      // Focus: 2px ring with 2px offset (matches page background: sepia-50 light / sepia-1000 dark)
      // Ring color set via inline style to match button background color
      secondary: `
        bg-secondary-700 hover:bg-secondary-600 active:bg-secondary-500 text-secondary-50
        dark:bg-secondary-700 dark:hover:bg-secondary-600 dark:active:bg-secondary-500 dark:text-secondary-50
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
      `,

      // ⚠️ GHOST - Uses neutral secondary tokens for subtle UI
      // Uses secondary (sepia) colors for hover states - no strong semantic meaning
      // Focus: 2px ring with 2px offset (matches page background: sepia-50 light / sepia-1000 dark)
      // Ring color set via inline style to ensure consistency
      ghost: `
        bg-transparent hover:bg-secondary-200 active:bg-secondary-300 text-secondary-900
        dark:hover:bg-secondary-700 dark:active:bg-secondary-600 dark:text-secondary-50
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
      `,

      // ⚠️ LINK - Uses semantic primary tokens for link color
      // Links should use primary brand color
      // Focus: 2px ring with 2px offset (matches page background: sepia-50 light / sepia-1000 dark)
      // Ring color set via inline style to ensure consistency
      link: `
        bg-transparent hover:underline text-primary-600 hover:text-primary-700
        dark:text-primary-400 dark:hover:text-primary-300
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
      `,

      // ⚠️ OUTLINE - Uses neutral secondary tokens for borders
      // Uses secondary (sepia) colors for border and text - neutral appearance
      // Focus: 2px ring with 2px offset (matches page background: sepia-50 light / sepia-1000 dark)
      // Ring color set via inline style to ensure consistency
      outline: `
        bg-transparent border border-secondary-300 hover:border-secondary-400 hover:bg-secondary-50
        active:bg-secondary-100 text-secondary-900
        dark:border-secondary-700 dark:hover:border-secondary-600 dark:hover:bg-secondary-900
        dark:active:bg-secondary-800 dark:text-secondary-50
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
      `,

      // ⚠️ DESTRUCTIVE - Uses semantic error tokens (resolves to red)
      // Error tokens for dangerous/destructive actions
      // Focus: 2px ring with 2px offset (matches page background: sepia-50 light / sepia-1000 dark)
      // Ring color set via inline style to match button background color (error-600 light, error-500 dark)
      destructive: `
        bg-error-600 hover:bg-error-700 active:bg-error-800 text-white
        dark:bg-error-500 dark:hover:bg-error-600 dark:active:bg-error-700
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
      `,

      // ✓ ICON - Icon-only buttons (square, no text padding)
      // Uses neutral sepia colors for subtle appearance
      // Light: sepia-100 bg → sepia-200 hover | sepia-900 text
      // Dark: sepia-800 bg → sepia-700 hover | sepia-50 text
      // Disabled has reduced contrast in both themes
      // Border radius is set in sizeStyles (rounded-md = 6px, matches small buttons)
      // Ring color set via inline style to ensure consistency
      icon: `
        bg-sepia-100 hover:bg-sepia-200 active:bg-sepia-300 text-sepia-900
        dark:bg-sepia-800 dark:hover:bg-sepia-700 dark:active:bg-sepia-600 dark:text-sepia-50
        disabled:bg-sepia-50 disabled:text-sepia-300 dark:disabled:bg-sepia-900 dark:disabled:text-sepia-700
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
      `,
    };

    // ICON SIZING - Icons scale with button size
    // Small: 16px, Medium: 20px, Large: 24px, Icon: 20px
    const iconSizeStyles = {
      small: "w-4 h-4",    // 16px
      medium: "w-5 h-5",   // 20px
      large: "w-6 h-6",    // 24px
      icon: "w-5 h-5",     // 20px
    };

    // GAP SPACING - Space between icon and text
    // Intentional variation: Smaller gaps for smaller buttons maintain visual balance
    // Small: 6px (gap-1.5) - tighter spacing for compact buttons
    // Medium: 8px (gap-2) - standard spacing for most use cases
    // Large: 10px (gap-2.5) - slightly more breathing room for larger buttons
    const gapStyles = {
      small: "gap-1.5",    // 6px - tighter for visual balance in compact buttons
      medium: "gap-2",     // 8px - standard spacing
      large: "gap-2.5",    // 10px - more breathing room for larger buttons
      icon: "gap-0",       // No gap for icon-only
    };

    // Helper function to wrap icons with proper sizing classes
    // This ensures icons are perfectly centered and aligned with text
    const renderIcon = (icon: React.ReactNode) => {
      if (!icon) return null;
      
      // If it's a React element, clone it with size classes
      if (typeof icon === 'object' && icon !== null && 'type' in icon) {
        return (
          <span className={`inline-flex items-center justify-center shrink-0 ${iconSizeStyles[size]}`}>
            {icon}
          </span>
        );
      }
      
      // Otherwise just render it as-is
      return icon;
    };

    // Helper function to wrap children with icon sizing when button is icon-only
    // For icon-only buttons, children should be icons and need consistent sizing based on button size
    // Icon sizes match buttons with labels: small=16px, medium=20px, large=24px
    const renderChildren = () => {
      const iconOnly = isIconOnly();
      
      // If this is an icon-only button (any variant), wrap children with icon size classes
      if (iconOnly && children) {
        // Determine the effective size (handle legacy "icon" size as "medium")
        const effectiveSize = size === "icon" ? "medium" : size;
        
        // Check if children is a single React element (icon)
        if (typeof children === 'object' && children !== null && 'type' in children) {
          return (
            <span className={`inline-flex items-center justify-center shrink-0 ${iconSizeStyles[effectiveSize]}`}>
              {children}
            </span>
          );
        }
        // If children is already wrapped or contains multiple elements, wrap the whole thing
        return (
          <span className={`inline-flex items-center justify-center shrink-0 ${iconSizeStyles[effectiveSize]}`}>
            {children}
          </span>
        );
      }
      
      // For regular buttons, render children as-is
      return children;
    };

    // Focus ring color styles - Set CSS variable directly to ensure correct colors
    // This overrides any Tailwind class conflicts and prevents browser default outline
    // Colors match the button background colors for visual consistency
    // Note: All ring colors are set via inline style to ensure they override any global styles
    const focusRingStyles: React.CSSProperties = {
      '--tw-ring-color': 
        variant === 'primary' ? 'var(--color-primary-400)' :
        variant === 'secondary' ? 'var(--color-secondary-700)' :
        variant === 'destructive' ? 'var(--focus-ring-destructive)' : // Theme-aware: error-600 light, error-500 dark
        variant === 'ghost' ? 'var(--color-secondary-300)' : // Light mode color (dark mode handled by CSS)
        variant === 'outline' ? 'var(--color-secondary-300)' : // Light mode color (dark mode handled by CSS)
        variant === 'link' ? 'var(--color-primary-600)' :
        variant === 'icon' ? 'var(--color-sepia-300)' :
        undefined,
      // Ensure no browser default outline appears
      outline: 'none',
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${getSizeStyles()} ${variantStyles[variant]} ${gapStyles[size]} ${className}`}
        style={focusRingStyles}
        {...props}
      >
        {/* Left icon (if provided) */}
        {iconLeft && renderIcon(iconLeft)}
        
        {/* Button text/children - automatically wraps icons when size="icon" */}
        {renderChildren()}
        
        {/* Right icon (if provided) */}
        {iconRight && renderIcon(iconRight)}
      </button>
    );
  }
);

// Set display name for debugging
Button.displayName = "Button";

