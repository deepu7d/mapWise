// hooks/useDebouncedEffect.ts
"use client";

import { useEffect, DependencyList } from 'react';

export function useDebouncedEffect(
  effect: () => void,
  deps: DependencyList,
  delay: number
) {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    // This cleanup function will cancel the timeout if the dependencies change
    // before the delay has passed, effectively resetting the debounce timer.
    return () => clearTimeout(handler);
  }, [...(deps || []), delay]); // Re-run the effect if dependencies or delay change
}