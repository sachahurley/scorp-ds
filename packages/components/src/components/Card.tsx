/**
 * CARD COMPONENT
 * 
 * Reusable card component with header, content, and footer sections
 * Built using design tokens for consistent styling
 * 
 * Features:
 * - Optional header with title and subtitle
 * - Flexible content area
 * - Optional footer for actions
 * - Consistent spacing and styling
 */

import { type ReactNode } from "react";

export interface CardProps {
  // Header content
  title?: string;
  subtitle?: string;
  headerContent?: ReactNode; // Custom header content (overrides title/subtitle)
  
  // Main content
  children: ReactNode;
  
  // Footer content
  footerContent?: ReactNode;
  
  // Styling
  className?: string;
}

/**
 * Card Component
 * 
 * @param title - Card title (shown in header)
 * @param subtitle - Card subtitle/description (shown below title)
 * @param headerContent - Custom header content (overrides title/subtitle if provided)
 * @param children - Main card content
 * @param footerContent - Footer content (buttons, links, etc.)
 * @param className - Additional CSS classes
 */
export function Card({
  title,
  subtitle,
  headerContent,
  children,
  footerContent,
  className = "",
}: CardProps) {
  // Check if className includes flex classes to enable flex layout
  const isFlexLayout = className.includes('flex');
  
  // PLATE RING RECIPE — outer layer is the stroke clipped to the large plate,
  // inner layer is the card fill clipped 1px inset. Note: the clip bounds any
  // overflowing children (menus should render outside the card or via portals).
  return (
    <div
      className={`
        plate-round-lg p-px bg-[var(--surface-container-stroke)]
        ${isFlexLayout ? 'flex flex-col' : ''}
        ${className}
      `}
    >
    <div
      className={`
        plate-round-lg bg-[var(--surface-card)] h-full w-full
        ${isFlexLayout ? 'flex flex-col flex-1 min-h-0' : ''}
      `}
    >
      {/* Header Section — plain title + subtitle (box-drawing decoration retired with the TUI tier) */}
      {(title || subtitle || headerContent) && (
        <div className="p-4 lg:p-6 border-b-[0.5px] border-solid border-[var(--surface-container-stroke)] overflow-hidden rounded-none">
          {headerContent ? (
            headerContent
          ) : (
            <div>
              {title && (
                <h3 className="text-base font-mono font-bold text-[var(--text-primary)] mb-1">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-mono text-sm text-secondary-800 dark:text-secondary-300">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className={`p-4 lg:p-6 ${isFlexLayout ? 'flex-1 flex flex-col min-h-0' : ''}`}>
        {children}
      </div>

      {/* Footer Section */}
      {footerContent && (
        <div className="p-4 lg:p-6 border-t-[0.5px] border-solid border-[var(--surface-container-stroke)] bg-[var(--surface-subtle)] overflow-hidden">
          {footerContent}
        </div>
      )}
    </div>
    </div>
  );
}

