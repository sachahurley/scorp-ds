/**
 * DROPDOWN COMPONENT
 * 
 * A button that opens a menu of actions (action menu dropdown)
 * Built with accessibility in mind - keyboard navigation, ARIA attributes
 * 
 * Features:
 * - Click outside to close
 * - Keyboard navigation (Arrow keys, Escape, Enter)
 * - Customizable trigger (any React element)
 * - Icon support for menu items
 * - Destructive action styling
 * - Left or right alignment
 */

import { useState, useRef, useEffect, type ReactNode } from "react";

// Menu item interface
export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode; // Left icon (grouped with label)
  iconRight?: ReactNode; // Right icon (aligned to right edge)
  variant?: "default" | "destructive";
  disabled?: boolean;
}

// Dropdown component props
export interface DropdownProps {
  trigger?: ReactNode; // Custom trigger element (defaults to button with chevron)
  items: DropdownItem[];
  align?: "left" | "right";
  label?: string; // Label for the default trigger button
  size?: "small" | "medium" | "large"; // Size variant matching buttons/inputs
}

/**
 * Dropdown Component
 * 
 * @param trigger - Custom trigger element (optional, defaults to button)
 * @param items - Array of menu items with labels, onClick handlers, and optional icons
 * @param align - Menu alignment: "left" or "right" (default: "left")
 * @param label - Label text for default trigger button (default: "Actions")
 */
export function Dropdown({ 
  trigger, 
  items, 
  align = "left",
  label = "Actions",
  size = "medium"
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown open/closed
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(-1); // Reset focus when opening
    }
  };

  // Close dropdown
  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  // Handle item click
  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      closeDropdown();
    }
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
      if (!isOpen) return;

      const enabledItems = items.filter(item => !item.disabled);
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
            return nextIndex >= enabledItems.length ? 0 : nextIndex;
          });
          break;
        
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prevIndex) => {
            const nextIndex = prevIndex - 1;
            return nextIndex < 0 ? enabledItems.length - 1 : nextIndex;
          });
          break;
        
        case "Enter":
        case " ":
          event.preventDefault();
          if (currentIndex >= 0 && currentIndex < enabledItems.length) {
            handleItemClick(enabledItems[currentIndex]);
          }
          break;
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, focusedIndex, items]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && menuRef.current) {
      const items = menuRef.current.querySelectorAll('[role="menuitem"]');
      const focusedItem = items[focusedIndex] as HTMLElement;
      if (focusedItem) {
        focusedItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex]);

  // Size styles matching buttons and inputs
  // Small: 32px height, 6px corner radius (rounded-md)
  // Medium: 40px height, 8px corner radius (rounded-lg)
  // Large: 48px height, 12px corner radius (rounded-button)
  const sizeStyles = {
    small: {
      button: "h-8 px-4 py-1.5 rounded-none",       // TUI: sharp corners
      menu: "rounded-none",
      menuItem: "",
      icon: "w-4 h-4",
    },
    medium: {
      button: "h-10 px-5 py-2.5 rounded-none",      // TUI: sharp corners
      menu: "rounded-none",
      menuItem: "",
      icon: "w-5 h-5",
    },
    large: {
      button: "h-12 px-6 py-3.5 rounded-none",      // TUI: sharp corners
      menu: "rounded-none",
      menuItem: "",
      icon: "w-6 h-6",
    },
  };

  const currentSizeStyles = sizeStyles[size];

  // Default trigger button if none provided
  const defaultTrigger = (
    <button
      onClick={toggleDropdown}
      className={`
        inline-flex items-center justify-center gap-2
        font-mono text-sm
        ${currentSizeStyles.button}
        transition-colors duration-200
        cursor-pointer
        bg-secondary-700 hover:bg-secondary-600 active:bg-secondary-500 text-secondary-50
        dark:bg-secondary-700 dark:hover:bg-secondary-600 dark:active:bg-secondary-500 dark:text-secondary-50
        focus:ring-2 focus:ring-secondary-700 dark:focus:ring-secondary-700 focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
      `}
      aria-haspopup="true"
      aria-expanded={isOpen}
    >
      {label}
      {/* TUI Tier 2: Unicode ▼ instead of Lucide ChevronDown */}
      <span className={`${currentSizeStyles.icon} inline-flex items-center justify-center font-mono leading-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">▼</span>
    </button>
  );

  // If custom trigger provided, wrap it with click handler
  const triggerElement = trigger ? (
    <div onClick={toggleDropdown} role="button" tabIndex={0} onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown();
      }
    }}>
      {trigger}
    </div>
  ) : defaultTrigger;

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Trigger */}
      {triggerElement}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          className={`
            absolute top-full mt-2
            ${align === "right" ? "right-0" : "left-0"}
            min-w-[200px]
            bg-white dark:bg-sepia-975
            border border-sepia-300 dark:border-sepia-700
            ${currentSizeStyles.menu}
            shadow-none
            z-[1051]
            animate-in fade-in slide-in-from-top-2 duration-200
          `}
        >
          {items.map((item, index) => {
            const isDestructive = item.variant === "destructive";
            const isDisabled = item.disabled;
            const isFocused = focusedIndex === index;
            
            return (
              <button
                key={index}
                role="menuitem"
                disabled={isDisabled}
                onClick={() => handleItemClick(item)}
                className={`
                  w-full flex items-center gap-2
                  px-4 py-3
                  font-mono text-sm text-left
                  transition-colors duration-150
                  ${isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : isDestructive
                      ? 'text-error-600 dark:text-error-500 hover:bg-error-50 dark:hover:bg-error-950/20'
                      : 'text-sepia-900 dark:text-sepia-50 hover:bg-sepia-200 dark:hover:bg-sepia-900'
                  }
                  ${isFocused && !isDisabled ? 'bg-sepia-200 dark:bg-sepia-900' : ''}
                  ${currentSizeStyles.menuItem}
                `}
              >
                {/* Left icon and label grouped together */}
                {/* Gap-2 (8px) matches medium button gap spacing for consistency */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {item.icon && (
                    <span className={`inline-flex items-center justify-center ${currentSizeStyles.icon} flex-shrink-0`}>
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate">{item.label}</span>
                </div>
                
                {/* Right icon aligned to right edge */}
                {item.iconRight && (
                  <span className={`inline-flex items-center justify-center ${currentSizeStyles.icon} flex-shrink-0 ml-auto`}>
                    {item.iconRight}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

