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
import { TuiIcon } from "./TuiIcon";

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
  // Small: 32px height / Medium: 40px / Large: 48px
  // Corners: plate silhouette (--plate-round) is the shape language; radius tokens are retired
  const sizeStyles = {
    small: {
      button: "h-8 px-4 py-1.5 plate-round",
      menu: "",
      menuItem: "",
      icon: "w-4 h-4",
    },
    medium: {
      button: "h-10 px-5 py-2.5 plate-round",
      menu: "",
      menuItem: "",
      icon: "w-5 h-5",
    },
    large: {
      button: "h-12 px-6 py-3.5 plate-round",
      menu: "",
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
        transition-colors [transition-duration:var(--duration-normal)]
        cursor-pointer
        bg-[var(--button-secondary-background)] hover:bg-[var(--button-secondary-background-hover)] active:brightness-95
        text-[var(--button-secondary-text)] hover:text-[var(--button-secondary-text-hover)]
        focus:outline-none focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-secondary)]
      `}
      aria-haspopup="true"
      aria-expanded={isOpen}
    >
      {label}
      {/* TUI Tier 2: Unicode ▼ instead of Lucide ChevronDown */}
      <span className={`${currentSizeStyles.icon} inline-flex items-center justify-center font-mono leading-none transition-transform [transition-duration:var(--duration-normal)] ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true"><TuiIcon name="ChevronDown" /></span>
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

      {/* Dropdown Menu — plate ring recipe (border color clipped + fill inset 1px;
          clip-path slices real borders, so the ring is a wrapper layer) */}
      {isOpen && (
        <div
          style={{ animationDuration: "var(--duration-normal)" }}
          className={`
            absolute top-full mt-2
            ${align === "right" ? "right-0" : "left-0"}
            min-w-[200px]
            plate-round p-px bg-[var(--border-default)]
            z-[1051]
            animate-in fade-in slide-in-from-top-2
          `}
        >
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          className={`plate-round bg-[var(--surface-card)] ${currentSizeStyles.menu}`}
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
                  transition-colors [transition-duration:var(--duration-fast)]
                  ${isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : isDestructive
                      ? 'text-error-600 hover:bg-[var(--field-background-error)]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]'
                  }
                  ${isFocused && !isDisabled ? 'bg-[var(--surface-subtle)]' : ''}
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
        </div>
      )}
    </div>
  );
}

