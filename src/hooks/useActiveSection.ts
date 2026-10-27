import { useEffect, useState } from 'react';

/** Tracks which [data-nav] section crosses the vertical middle of the viewport. */
export function useActiveNav() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]'));
    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target, e.isIntersecting));
        const hit = sections.find((s) => visible.get(s));
        setActive(hit ? hit.dataset.nav || null : null);
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return active;
}
