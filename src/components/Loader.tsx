import { useEffect, useRef, useState } from 'react';
import { gsap, EASE, reducedMotion } from '../lib/motion';
import { Emblem } from './Logo';

/** Restrained opening: emblem draws, counter runs, curtain lifts. */
export function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('is-loading');
    const finish = () => {
      html.classList.remove('is-loading');
      onDone();
    };
    let imgReady = false;
    const img = new Image();
    img.onload = img.onerror = () => (imgReady = true);
    img.src = '/media/hero-first.webp';

    const ctx = gsap.context(() => {
      if (reducedMotion()) {
        gsap.to(root.current, { opacity: 0, duration: 0.3, onStart: finish, onComplete: () => setGone(true) });
        return;
      }
      const state = { v: 0 };
      const paths = root.current!.querySelectorAll('svg path[stroke-dashoffset]');
      const tl = gsap.timeline();
      tl.to(state, {
        v: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (count.current) count.current.textContent = String(Math.round(state.v)).padStart(3, '0');
        },
      })
        .to(paths, { strokeDashoffset: 0, duration: 1.2, stagger: 0.25, ease: EASE.inOut }, 0)
        .to('[data-load-bar]', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
        .add(() => {
          // never block longer than ~2s for the first frame
          const t0 = performance.now();
          const wait = () => {
            if (imgReady || performance.now() - t0 > 2000) exit();
            else requestAnimationFrame(wait);
          };
          wait();
        });
      const exit = () => {
        gsap
          .timeline()
          .to('[data-load-content]', { opacity: 0, y: -16, duration: 0.45, ease: EASE.soft })
          .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.0, ease: EASE.inOut, onStart: () => setTimeout(finish, 350) }, '-=0.1')
          .add(() => setGone(true));
      };
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[100] flex items-center justify-center bg-ink" role="status" aria-label="Loading APEX MOTORS">
      <div data-load-content className="flex w-[min(320px,70vw)] flex-col items-center gap-8">
        <Emblem className="h-16 w-16 text-bone" draw />
        <div className="w-full">
          <div className="h-px w-full bg-white/10">
            <div data-load-bar className="h-full origin-left scale-x-0 bg-burnt" />
          </div>
          <div className="mt-4 flex items-baseline justify-between text-mute">
            <span className="t-label">Apex Motors</span>
            <span ref={count} className="t-cond text-[22px] tabular-nums text-bone">000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
