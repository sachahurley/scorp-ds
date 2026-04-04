/**
 * SELECT COMPONENT
 * 
 * Custom select dropdown component with multiple sizes
 * Uses custom dropdown menu matching Dropdown component styling
 * Built entirely from design tokens defined in tokens.json
 * 
 * SIZES: Matching input heights
 * - small: 32px height
 * - medium: 40px height (default)
 * - large: 48px height
 * 
 * STATES:
 * - default: Standard select appearance
 * - hover: Subtle border change on mouse over
 * - focused: Primary color focus ring (keyboard accessible)
 * - disabled: Reduced opacity, not interactive
 * - error: Red border to indicate validation issues
 * 
 * Features:
 * - Custom dropdown menu matching Dropdown component styling
 * - Keyboard navigation (Arrow keys, Escape, Enter)
 * - Click outside to close
 * - Maintains form compatibility with hidden native select
 */

import { useState, useRef, useEffect, forwardRef, useImperativeHandle, type ReactNode, type SelectHTMLAttributes } from "react";

// Define the props interface for the Select component
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: "small" | "medium" | "large";
  error?: boolean;
}

/**
 * Select Component
 * 
 * @param size - Select size matching input heights (default: "medium")
 * @param error - Whether select has a validation error
 * @param disabled - Whether select is disabled
 * @param className - Additional CSS classes to apply
 * @param children - Option elements to display in the dropdown
 * @param value - Controlled value
 * @param defaultValue - Uncontrolled default value
 * @param onChange - Change handler
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({
  size = "medium",
  error = false,
  disabled = false,
  className = "",
  children,
  value,
  defaultValue,
  onChange,
  name,
  ...props
}, ref) {
  // Parse option elements from children
  const parseOptions = (): Array<{ value: string; label: string; disabled?: boolean }> => {
    const options: Array<{ value: string; label: string; disabled?: boolean }> = [];
    
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (typeof child === 'object' && child !== null && 'props' in child) {
          const props = child.props as { value?: string; children?: ReactNode; disabled?: boolean };
          options.push({
            value: props.value || '',
            label: typeof props.children === 'string' ? props.children : String(props.children || ''),
            disabled: props.disabled,
          });
        }
      });
    } else if (typeof children === 'object' && children !== null && 'props' in children) {
      const props = (children as any).props;
      options.push({
        value: props.value || '',
        label: typeof props.children === 'string' ? props.children : String(props.children || ''),
        disabled: props.disabled,
      });
    }
    
    return options;
  };

  const options = parseOptions();
  
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [selectedValue, setSelectedValue] = useState<string>(
    value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : options[0]?.value || ''
  );
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hiddenSelectRef = useRef<HTMLSelectElement>(null);

  // Sync with controlled value prop
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(String(value));
      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = String(value);
      }
    }
  }, [value]);

  // Expose ref to hidden select element
  useImperativeHandle(ref, () => hiddenSelectRef.current as HTMLSelectElement);

  // Get selected option label
  const selectedOption = options.find(opt => opt.value === selectedValue);
  const selectedLabel = selectedOption?.label || '';

  // Toggle dropdown open/closed
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setFocusedIndex(-1);
      }
    }
  };

  // Close dropdown
  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (value === undefined) {
      // Uncontrolled mode
      setSelectedValue(optionValue);
    }
    
    // Update hidden select for form submission
    if (hiddenSelectRef.current) {
      hiddenSelectRef.current.value = optionValue;
    }
    
    // Call onChange if provided
    if (onChange) {
      const syntheticEvent = {
        target: { value: optionValue, name },
        currentTarget: { value: optionValue, name },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
    
    closeDropdown();
  };

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Only handle if dropdown is focused or open
      if (!dropdownRef.current?.contains(event.target as Node) && !isOpen) {
        return;
      }

      if (!isOpen) {
        // Allow opening with Enter/Space/ArrowDown/ArrowUp when closed
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          if (dropdownRef.current?.contains(event.target as Node)) {
            event.preventDefault();
            toggleDropdown();
            // Set initial focus to selected option or first option
            const enabledOptions = options.filter(opt => !opt.disabled);
            const selectedIndex = enabledOptions.findIndex(opt => opt.value === selectedValue);
            setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
          }
        }
        return;
      }

      const enabledOptions = options.filter(opt => !opt.disabled);
      const currentIndex = focusedIndex;

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          closeDropdown();
          break;
        
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            return nextIndex >= enabledOptions.length ? 0 : nextIndex;
          });
          break;
        
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prevIndex) => {
            const nextIndex = prevIndex - 1;
            return nextIndex < 0 ? enabledOptions.length - 1 : nextIndex;
          });
          break;
        
        case "Enter":
        case " ":
          event.preventDefault();
          if (currentIndex >= 0 && currentIndex < enabledOptions.length) {
            handleSelect(enabledOptions[currentIndex].value);
          }
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, focusedIndex, options, selectedValue]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && menuRef.current) {
      const items = menuRef.current.querySelectorAll('[role="option"]');
      // Find the actual DOM index of the focused option
      let domIndex = 0;
      let enabledCount = 0;
      for (let i = 0; i < items.length; i++) {
        const option = options[i];
        if (!option.disabled) {
          if (enabledCount === focusedIndex) {
            domIndex = i;
            break;
          }
          enabledCount++;
        }
      }
      const focusedItem = items[domIndex] as HTMLElement;
      if (focusedItem) {
        focusedItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex, options]);

  // Size styles matching Dropdown component exactly
  const sizeStyles = {
    small: {
      trigger: "h-8 pl-3 pr-7 py-1.5 rounded-none",       // TUI: sharp corners
      menu: "rounded-none",
      menuItem: "",
      icon: "w-4 h-4",
    },
    medium: {
      trigger: "h-10 pl-4 pr-8 py-2.5 rounded-none",      // TUI: sharp corners
      menu: "rounded-none",
      menuItem: "",
      icon: "w-5 h-5",
    },
    large: {
      trigger: "h-12 pl-5 pr-9 py-3.5 rounded-none",      // TUI: sharp corners
      menu: "rounded-none",
      menuItem: "",
      icon: "w-6 h-6",
    },
  };

  const currentSizeStyles = sizeStyles[size];

  // STATE STYLES - Color combinations for different states using SEMANTIC TOKENS
  const triggerStyles = error
    ? `
      border-error-600 dark:border-error-500
      bg-error-50 dark:bg-error-950/20
      text-sepia-900 dark:text-sepia-50
      focus:ring-2 focus:ring-error-600 dark:focus:ring-error-500 
      focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
      focus:border-error-600 dark:focus:border-error-500
    `
    : `
      border-sepia-300 dark:border-sepia-700
      hover:border-sepia-400 dark:hover:border-sepia-600
      bg-white dark:bg-sepia-975
      text-sepia-900 dark:text-sepia-50
      focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-400
      focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
    `;

  return (
    <div ref={dropdownRef} className={`relative inline-block w-full ${className}`}>
      {/* Hidden native select for form submission */}
      <select
        ref={hiddenSelectRef}
        name={name}
        value={selectedValue}
        onChange={onChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom trigger button */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full
          flex items-center justify-between
          font-mono text-sm
          border
          transition-all duration-200
          ${currentSizeStyles.trigger}
          ${triggerStyles}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={props['aria-label'] || 'Select an option'}
      >
        <span className="truncate text-left flex-1">{selectedLabel || 'Select...'}</span>
        {/* TUI Tier 2: Unicode ▼ instead of Lucide ChevronDown */}
        <span
          className={`
            ${currentSizeStyles.icon}
            inline-flex items-center justify-center font-mono leading-none
            text-sepia-600 dark:text-sepia-400
            transition-transform duration-200
            flex-shrink-0 ml-2
            ${isOpen ? 'rotate-180' : ''}
            ${disabled ? 'opacity-50' : ''}
          `}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {/* Custom dropdown menu - matching Dropdown component exactly */}
      {isOpen && (
        <div
          ref={menuRef}
          role="listbox"
          className={`
            absolute top-full mt-2 left-0 right-0
            min-w-[200px]
            bg-white dark:bg-sepia-975
            border border-sepia-300 dark:border-sepia-700
            ${currentSizeStyles.menu}
            shadow-none
            z-[1051]
            animate-in fade-in slide-in-from-top-2 duration-200
            max-h-[300px] overflow-y-auto
          `}
        >
          {options.map((option, index) => {
            const isDisabled = option.disabled;
            const isSelected = option.value === selectedValue;
            const enabledOptions = options.filter(opt => !opt.disabled);
            const enabledIndex = enabledOptions.findIndex(opt => opt.value === option.value);
            const isFocused = enabledIndex === focusedIndex && !isDisabled;
            
            return (
              <button
                key={index}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={isDisabled}
                onClick={() => !isDisabled && handleSelect(option.value)}
                className={`
                  w-full flex items-center gap-2
                  px-4 py-3
                  font-mono text-sm text-left
                  transition-colors duration-150
                  ${isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'text-sepia-900 dark:text-sepia-50 hover:bg-sepia-200 dark:hover:bg-sepia-900 cursor-pointer'
                  }
                  ${isFocused && !isDisabled ? 'bg-sepia-200 dark:bg-sepia-900' : ''}
                  ${currentSizeStyles.menuItem}
                `}
              >
                {/* Option label */}
                <span className="truncate flex-1 min-w-0">{option.label}</span>
                
                {/* TUI Tier 2: Unicode ✓ instead of Lucide Check */}
                {isSelected && (
                  <span className={`${currentSizeStyles.icon} inline-flex items-center justify-center font-mono font-bold text-primary-400 dark:text-primary-400 flex-shrink-0`} aria-hidden="true">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

// Set display name for debugging
Select.displayName = "Select";
