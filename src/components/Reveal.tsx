import { useEffect, useRef } from 'react';
import type { ElementType, ReactNode } from 'react';
import { gsap, ScrollTrigger, EASE, reducedMotion } from '../lib/motion';

/** Headline whose lines rise out of a mask when scrolled into view. */
export function Lines({
  lines,
  as: Tag = 'h2',
  className = '',
  start = 'top 88%',
  delay = 0,
  manual = false,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  start?: string;
  delay?: number;
  /** When true the parent timeline animates the spans (used by the hero). */
  manual?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const spans = ref.current?.querySelectorAll('.line-mask > span');
    if (!spans) return;
    const ctx = gsap.context(() => {
      gsap.set(spans, { yPercent: 115 });
      if (manual) return;
      ScrollTrigger.create({
        trigger: ref.current,
        start,
        once: true,
        onEnter: () => gsap.to(spans, { yPercent: 0, duration: 1.25, ease: EASE.out, stagger: 0.09, delay }),
      });
    }, ref);
    return () => ctx.revert();
  }, [manual, start, delay]);
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="line-mask">
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Small supporting element that eases in once. Kept subtle on purpose. */
export function Fade({ children, className = '', delay = 0, y = 18, as: Tag = 'div' }: { children: ReactNode; className?: string; delay?: number; y?: number; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(ref.current, { opacity: 0, y });
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 92%',
        once: true,
        onEnter: () => gsap.to(ref.current, { opacity: 1, y: 0, duration: 1.1, ease: EASE.out, delay }),
      });
    }, ref);
    return () => ctx.revert();
  }, [delay, y]);
  return <Tag ref={ref} className={className}>{children}</Tag>;
}

type Dir = 'up' | 'down' | 'left' | 'right';
const CLIP_FROM: Record<Dir, string> = {
  up: 'inset(100% 0% 0% 0%)',
  down: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
};

/**
 * Image mask: clip-path reveal on entry, then gentle scroll parallax and a slow settle zoom.
 * Children should fill the frame (absolute / object-cover).
 */
export function MediaFrame({
  children,
  className = '',
  dir = 'up',
  parallax = 7,
}: {
  children: ReactNode;
  className?: string;
  dir?: Dir;
  parallax?: number;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(outer.current, { clipPath: CLIP_FROM[dir] });
      gsap.set(inner.current, { scale: 1.15 });
      ScrollTrigger.create({
        trigger: outer.current,
        start: 'top 86%',
        once: true,
        onEnter: () => {
          gsap.to(outer.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: EASE.inOut });
          gsap.to(inner.current, { scale: 1, duration: 2.2, ease: EASE.out });
        },
      });
      if (parallax) {
        gsap.fromTo(
          inner.current,
          { yPercent: -parallax * 0.8 },
          { yPercent: parallax * 0.8, ease: 'none', scrollTrigger: { trigger: outer.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      }
    }, outer);
    return () => ctx.revert();
  }, [dir, parallax]);
  return (
    <div ref={outer} className={`relative overflow-hidden ${className}`}>
      <div ref={inner} className="absolute left-0 right-0 will-change-transform" style={{ top: `-${parallax}%`, bottom: `-${parallax}%` }}>
        {children}
      </div>
    </div>
  );
}
