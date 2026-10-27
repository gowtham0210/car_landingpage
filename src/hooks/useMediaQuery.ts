import { useEffect, useState } from 'react';

export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? initial : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
/** Pinned, scroll-scrubbed storytelling only on large landscape screens. */
export const useCinematic = () => {
  const wide = useMediaQuery('(min-width: 1024px) and (min-height: 600px)');
  const reduced = useReducedMotion();
  return wide && !reduced;
};
