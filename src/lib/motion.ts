import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/** One easing vocabulary for the whole site. */
export const EASE = {
  out: 'expo.out',
  inOut: 'power3.inOut',
  soft: 'power2.out',
} as const;

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Smooth-scroll to a section id. Handles GSAP pin-spacers so pinned sections resolve correctly. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const spacer = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
  if (reducedMotion()) {
    window.scrollTo({ top: spacer.getBoundingClientRect().top + window.scrollY });
    return;
  }
  gsap.to(window, {
    duration: Math.min(1.8, 0.8 + Math.abs(spacer.getBoundingClientRect().top) / 3500),
    ease: EASE.inOut,
    scrollTo: { y: spacer, autoKill: true },
    overwrite: true,
  });
}

export function scrollToTop() {
  if (reducedMotion()) return window.scrollTo({ top: 0 });
  gsap.to(window, { duration: 1.4, ease: EASE.inOut, scrollTo: { y: 0, autoKill: true }, overwrite: true });
}

export { gsap, ScrollTrigger };
