/**
 * BUTTON COMPONENT
 * 
 * Reusable button component with multiple variants and sizes
 * Built entirely from design tokens defined in tokens.json
 * 
 * VARIANTS (fills from semantic CSS variables in tokens.css — theme switches via `.dark`):
 * - primary / secondary: `--button-*` pairs for background, hover, text
 * - ghost / outline / destructive / link: same semantic layer
 * - icon: square chrome using `--button-icon-*` (background, hover, text, disabled)
 * 
 * SIZES: All defined in tokens.json
 * - small: 32px height
 * - medium: 40px height (default)
 * - large: 48px height
 */

import { forwardRef, useEffect, type ButtonHTMLAttributes, type CSSProperties } from "react";

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
 *
 * Icon-only usage: pass `aria-label` or `aria-labelledby` (standard button attributes) so assistive tech has an accessible name.
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
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
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
      transition-colors [transition-duration:var(--duration-normal)]
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

    useEffect(() => {
      if (process.env.NODE_ENV === "production") return;
      const iconOnly = variant === "icon" || isIconOnly();
      if (!iconOnly) return;
      const named =
        (ariaLabel != null && String(ariaLabel).trim() !== "") ||
        (ariaLabelledBy != null && String(ariaLabelledBy).trim() !== "");
      if (!named) {
        console.warn(
          "[@scorp-ds/components] Button: icon-only buttons should include aria-label or aria-labelledby for screen readers."
        );
      }
    }, [variant, size, children, iconLeft, iconRight, ariaLabel, ariaLabelledBy]);

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

    // VARIANT STYLES — semantic CSS variables from @scorp-ds/tokens (theme = :root / .dark)
    const variantStyles = {
      primary: `
        bg-[var(--button-primary-background)] hover:bg-[var(--button-primary-background-hover)] active:brightness-95
        text-[var(--button-primary-text)]
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--focus-offset-color)]
      `,

      secondary: `
        bg-[var(--button-secondary-background)] hover:bg-[var(--button-secondary-background-hover)] active:brightness-95
        text-[var(--button-secondary-text)]
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--focus-offset-color)]
      `,

      ghost: `
        bg-[var(--button-ghost-background)] hover:bg-[var(--button-ghost-background-hover)] active:brightness-95
        text-[var(--button-ghost-text)]
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--focus-offset-color)]
      `,

      link: `
        bg-transparent hover:underline
        text-[var(--button-link-text)] hover:text-[var(--button-link-text-hover)]
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--focus-offset-color)]
      `,

      outline: `
        border border-[var(--button-outline-border)]
        bg-[var(--button-outline-background)] hover:bg-[var(--button-outline-background-hover)] active:brightness-95
        text-[var(--button-outline-text)]
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--focus-offset-color)]
      `,

      destructive: `
        bg-[var(--button-destructive-background)] hover:bg-[var(--button-destructive-background-hover)] active:brightness-95
        text-[var(--button-destructive-text)]
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--focus-offset-color)]
      `,

      icon: `
        bg-[var(--button-icon-background)] hover:bg-[var(--button-icon-background-hover)] active:brightness-95
        text-[var(--button-icon-text)]
        disabled:bg-[var(--button-icon-disabled-background)] disabled:text-[var(--button-icon-disabled-text)]
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--focus-offset-color)]
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

    // Focus ring color — semantic tokens (values swap under .dark in tokens.css)
    const focusRingStyles = {
      '--tw-ring-color':
        variant === 'primary' || variant === 'link'
          ? 'var(--focus-ring-primary)'
          : variant === 'destructive'
            ? 'var(--focus-ring-destructive)'
            : variant === 'icon'
              ? 'var(--focus-ring-icon)'
              : 'var(--focus-ring-secondary)',
      outline: 'none',
    } as CSSProperties;

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${getSizeStyles()} ${variantStyles[variant]} ${gapStyles[size]} ${className}`}
        style={focusRingStyles}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
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

