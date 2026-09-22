/**
 * Shared size scale for controls.
 *
 * Every sized component takes `sm | md | lg` (Avatar adds `xl`). Heights come
 * from the control-height tokens (`h-control-sm|md|lg` = 32 / 40 / 48px).
 * The old `small | medium | large` names still work but are deprecated: they
 * map onto the new scale and log a one-time warning per component in
 * development, so consumers can migrate without a breaking change.
 */

export type ControlSize = "sm" | "md" | "lg";

/** @deprecated Use `sm`, `md`, or `lg`. */
export type LegacyControlSize = "small" | "medium" | "large";

/** What a sized component accepts: the scale plus the deprecated aliases. */
export type ControlSizeProp = ControlSize | LegacyControlSize;

const LEGACY: Record<string, ControlSize> = { small: "sm", medium: "md", large: "lg" };
const warned = new Set<string>();

/**
 * Normalizes a size prop onto the `sm | md | lg` scale. Legacy names resolve
 * to their new equivalent (with a one-time dev warning naming the component).
 */
export function resolveSize<T extends string = ControlSize>(size: string | undefined, component: string, fallback: T = "md" as T): T {
  if (size == null) return fallback;
  const mapped = LEGACY[size];
  if (mapped) {
    // Written as `=== "production"` so consumer vendor scripts can rewrite it
    const isProd = process.env.NODE_ENV === "production";
    if (!isProd && !warned.has(component)) {
      warned.add(component);
      console.warn(
        `[@scorp-ds/components] ${component}: size="${size}" is deprecated. Use size="${mapped}" (the scale is sm | md | lg).`
      );
    }
    return mapped as T;
  }
  return size as T;
}
