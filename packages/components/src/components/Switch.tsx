/**
 * SWITCH COMPONENT
 * 
 * Reusable toggle switch component with multiple sizes
 * Built using design tokens for consistent styling
 * 
 * SIZES: Proportional to button/input height system
 * - small: 24px height (h-6)
 * - medium: 32px height (h-8) - matches small button/input - default
 * - large: 40px height (h-10) - matches medium button/input
 * 
 * Features:
 * - Accessible (ARIA attributes, keyboard support)
 * - Focus states matching design system
 * - Smooth animations
 * - Optional label
 * - Optional icon inside knob (for special use cases like theme toggle)
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "small" | "medium" | "large";
  label?: string;
  disabled?: boolean;
  icon?: ReactNode; // Optional icon to display inside the knob (e.g., Moon/Sun for theme toggle)
}

/**
 * Switch Component
 * 
 * @param checked - Whether switch is checked/on (default: false)
 * @param onCheckedChange - Callback when switch state changes
 * @param size - Switch size (default: "medium")
 * @param label - Optional label text displayed next to switch
 * @param disabled - Whether switch is disabled
 * @param icon - Optional icon to display inside the knob (e.g., Moon/Sun for theme toggle)
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onCheckedChange,
      size = "medium",
      label,
      disabled = false,
      icon,
      className = "",
      ...props
    },
    ref
  ) => {
    // Size styles proportional to button/input system
    // Small: 24px height, 44px width
    // Medium: 32px height, 56px width (matches small button/input height)
    // Large: 40px height, 72px width (matches medium button/input height)
    const sizeStyles = {
      small: {
        track: "h-6 w-11",           // 24px × 44px
        knob: "h-5 w-5",            // 20px × 20px knob
        knobTranslate: checked ? 'translateX(22px)' : 'translateX(2px)', // Unchecked: 2px from left (perfect), Checked: 22px (2px gap from right edge)
        iconSize: "w-3 h-3",         // 12px icon for small knob
      },
      medium: {
        track: "h-8 w-14",          // 32px × 56px (matches small button height)
        knob: "h-6 w-6",            // 24px × 24px knob
        knobTranslate: checked ? 'translateX(29px)' : 'translateX(3px)', // Unchecked: 3px from left (1px right), Checked: 29px (1px left from previous)
        iconSize: "w-3 h-3",         // 12px icon for medium knob (matches ThemeToggle)
      },
      large: {
        track: "h-10 w-[72px]",     // 40px × 72px (matches medium button height)
        knob: "h-8 w-8",            // 32px × 32px knob
        knobTranslate: checked ? 'translateX(37px)' : 'translateX(3px)', // Unchecked: 3px from left (1px right), Checked: 37px (3px left from previous)
        iconSize: "w-4 h-4",         // 16px icon for large knob
      },
    };

    const currentSizeStyles = sizeStyles[size];

    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!disabled && onCheckedChange) {
          onCheckedChange(!checked);
        }
      }
    };

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Switch Track */}
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label || (checked ? "On" : "Off")}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`
            relative inline-flex items-center
            ${currentSizeStyles.track}
            rounded-none
            transition-colors duration-300
            focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${checked 
              ? 'bg-primary-400 dark:bg-primary-400' 
              : 'bg-sepia-300 dark:bg-sepia-700'
            }
          `}
          {...props}
        >
          {/* Sliding Knob */}
          <span
            className={`
              inline-flex items-center justify-center
              ${currentSizeStyles.knob}
              rounded-none
              bg-white dark:bg-secondary-900
              shadow-none
              transform transition-transform duration-300
            `}
            style={{
              transform: currentSizeStyles.knobTranslate,
            }}
          >
            {/* Optional icon inside knob */}
            {icon && (
              <span className={currentSizeStyles.iconSize}>
                {icon}
              </span>
            )}
          </span>
        </button>

        {/* Optional Label */}
        {label && (
          <span className={`text-sm font-mono text-sepia-900 dark:text-sepia-50 ${disabled ? 'opacity-50' : ''}`}>
            {label}
          </span>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

