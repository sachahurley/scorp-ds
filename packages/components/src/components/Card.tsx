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
  
  return (
    <div
      className={`
        bg-[var(--surface-card)]
        border-[0.5px] border-solid border-sepia-500 dark:border-sepia-800
        rounded-none
        overflow-visible
        ${isFlexLayout ? 'flex flex-col' : ''}
        ${className}
      `}
    >
      {/* Header Section -- TUI Tier 2: box-drawing title bar ┌── Title ──┐ */}
      {(title || subtitle || headerContent) && (
        <div className="p-4 lg:p-6 border-b-[0.5px] border-solid border-sepia-500 dark:border-sepia-800 overflow-hidden rounded-none">
          {headerContent ? (
            headerContent
          ) : (
            <div>
              {title && (
                <h3 className="text-base font-mono font-bold text-sepia-900 dark:text-sepia-50 mb-1 flex items-center gap-0">
                  {/* Box-drawing prefix */}
                  <span className="text-term-dim dark:text-term-amber whitespace-pre" aria-hidden="true">┌── </span>
                  {title}
                  {/* Box-drawing suffix -- flexible line fills remaining width */}
                  <span className="text-term-dim dark:text-term-amber ml-1 flex-1 overflow-hidden whitespace-nowrap" aria-hidden="true">
                    {"─".repeat(80)}
                  </span>
                  <span className="text-term-dim dark:text-term-amber whitespace-pre" aria-hidden="true"> ──┐</span>
                </h3>
              )}
              {subtitle && (
                <p className="text-sm font-mono text-sepia-600 dark:text-sepia-400 pl-[3ch]">
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
        <div className="p-4 lg:p-6 border-t-[0.5px] border-solid border-sepia-500 dark:border-sepia-800 bg-sepia-50 dark:bg-sepia-975 overflow-hidden rounded-none">
          {footerContent}
        </div>
      )}
    </div>
  );
}

