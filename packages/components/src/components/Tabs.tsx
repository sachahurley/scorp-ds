/**
 * TABS — WAI-ARIA tablist / tab / tabpanel pattern for switching related views.
 * TUI-friendly: sharp corners, monospace, underline-style selection on the tab strip.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";

type TabsContextValue = {
  value: string;
  onValueChange: (next: string) => void;
  baseId: string;
  listValuesRef: React.MutableRefObject<string[]>;
  isControlled: boolean;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(`[@scorp-ds/components] ${component} must be used inside <Tabs>.`);
  }
  return ctx;
}

export interface TabsProps {
  /** Selected panel id (controlled). */
  value?: string;
  /** Initial panel when uncontrolled; use `undefined` to auto-select the first tab. */
  defaultValue?: string;
  /** Fires when the active tab changes. */
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

/**
 * Root tabs container. Provide either controlled `value` + `onValueChange`, or `defaultValue`.
 */
export function Tabs({
  value: valueProp,
  defaultValue,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(() => defaultValue ?? "");
  const value = isControlled ? (valueProp as string) : uncontrolled;
  const baseId = useId().replace(/:/g, "");
  const listValuesRef = useRef<string[]>([]);

  const onValueChangeInner = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const ctx = useMemo(
    () => ({
      value,
      onValueChange: onValueChangeInner,
      baseId,
      listValuesRef,
      isControlled,
    }),
    [value, onValueChangeInner, baseId, isControlled]
  );

  return (
    <TabsContext.Provider value={ctx}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function triggerValuesFromListChildren(children: ReactNode): string[] {
  const out: string[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const name = (child.type as { displayName?: string }).displayName;
    if (name === "TabsTrigger") {
      const v = (child.props as { value?: string }).value;
      if (typeof v === "string") out.push(v);
    }
  });
  return out;
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
  /** Accessible name for the tab strip (pass this or `aria-labelledby`). */
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * Tab buttons row. Direct children should be `TabsTrigger` elements only (order defines keyboard flow).
 */
export function TabsList({
  children,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: TabsListProps) {
  const { value, isControlled, onValueChange, listValuesRef } = useTabsContext("TabsList");
  const values = triggerValuesFromListChildren(children);
  listValuesRef.current = values;
  const valuesKey = values.join("\0");

  useLayoutEffect(() => {
    const ordered = listValuesRef.current;
    if (isControlled || ordered.length === 0) return;
    if (!ordered.includes(value)) {
      onValueChange(ordered[0]);
    }
  }, [isControlled, listValuesRef, onValueChange, value, valuesKey]);

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "flex flex-wrap gap-0 border-b-[0.5px] border-solid border-[var(--surface-container-stroke)]",
        className
      )}
    >
      {children}
    </div>
  );
}

TabsList.displayName = "TabsList";

export type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Id matching a `TabsContent` `value`. */
  value: string;
  children: ReactNode;
};

/**
 * Tab button. Icon-only triggers should set `aria-label` (native button prop).
 */
export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, children, className, disabled, onKeyDown, onClick, type = "button", ...props },
  ref
) {
  const { value: selected, onValueChange, baseId, listValuesRef } = useTabsContext("TabsTrigger");
  const isSelected = selected === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  const focusTab = (next: string) => {
    onValueChange(next);
    requestAnimationFrame(() => {
      document.getElementById(`${baseId}-tab-${next}`)?.focus();
    });
  };

  const moveFocus = (delta: number) => {
    const vals = listValuesRef.current;
    const i = vals.indexOf(value);
    if (i < 0) return;
    const next = vals[(i + delta + vals.length) % vals.length];
    focusTab(next);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    const vals = listValuesRef.current;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        moveFocus(1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        moveFocus(-1);
        break;
      case "Home":
        e.preventDefault();
        if (vals[0]) focusTab(vals[0]);
        break;
      case "End":
        e.preventDefault();
        if (vals.length) focusTab(vals[vals.length - 1]);
        break;
      default:
        break;
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      role="tab"
      id={tabId}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      className={cn(
        "-mb-px rounded-none border-b-2 px-4 py-2 font-mono text-sm transition-colors [transition-duration:var(--duration-normal)]",
        isSelected
          ? "border-[var(--button-primary-background)] bg-transparent text-[var(--text-primary)]"
          : "border-transparent text-secondary-700 hover:text-[var(--text-primary)] dark:text-secondary-300",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && !disabled) {
          onValueChange(value);
        }
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
  /** Keep inactive panels mounted (hidden) so form state is preserved. */
  forceMount?: boolean;
}

/**
 * Panel for the matching `value`. Renders nothing when inactive unless `forceMount`.
 */
export function TabsContent({ value, children, className, forceMount = false }: TabsContentProps) {
  const { value: selected, baseId } = useTabsContext("TabsContent");
  const active = selected === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!forceMount && !active) {
    return null;
  }

  if (!active && forceMount) {
    return (
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId}
        hidden
        className={cn("p-4 font-mono outline-none", className)}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      className={cn(
        "p-4 font-mono outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-offset-color)]",
        className
      )}
    >
      {children}
    </div>
  );
}

TabsContent.displayName = "TabsContent";
