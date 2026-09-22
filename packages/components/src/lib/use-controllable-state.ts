/**
 * CONTROLLABLE STATE (internal)
 *
 * One hook for the controlled / uncontrolled pattern: when `value` is
 * defined the parent owns the state, otherwise the component keeps its own
 * copy seeded from `defaultValue`. `onChange` fires either way, so a
 * consumer can observe an uncontrolled component without taking it over.
 *
 * Not exported from the package barrel.
 */

import { useCallback, useRef, useState } from "react";

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined;
  defaultValue: T;
  onChange?: (next: T) => void;
}): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : internal;

  // Keep the latest callback without re-creating the setter every render
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const currentRef = useRef(current);
  currentRef.current = current;

  const set = useCallback(
    (next: T) => {
      if (Object.is(next, currentRef.current)) return;
      if (!controlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [controlled]
  );

  return [current, set];
}
