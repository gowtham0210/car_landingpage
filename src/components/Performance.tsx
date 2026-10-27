import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, EASE, reducedMotion } from '../lib/motion';
import { Lines, Fade, MediaFrame } from './Reveal';
import { TagLabel } from './Showcase';
import { Img } from './Img';

function Counter({ to, decimals = 0, className = '' }: { to: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (v: number) => v.toFixed(decimals);
  useEffect(() => {
    if (reducedMotion() || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      el.textContent = fmt(0);
      const o = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to(o, { v: to, duration: 2.4, ease: 'power3.out', onUpdate: () => (el.textContent = fmt(o.v)) }),
      });
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, decimals]);
  return <span ref={ref} className={`tabular-nums ${className}`}>{fmt(to)}</span>;
}

function Stat({ value, decimals, unit, label, big = false }: { value: number; decimals?: number; unit: string; label: string; big?: boolean }) {
  return (
    <div className="relative">
      <div className="flex items-baseline gap-3">
        <Counter to={value} decimals={decimals} className={`t-cond leading-[0.8] ${big ? 'text-[clamp(7rem,17vw,18rem)]' : 'text-[clamp(4.5rem,9vw,9.5rem)]'}`} />
        <span className={`t-display t-wide text-burnt ${big ? 'text-[clamp(1.1rem,2vw,2rem)]' : 'text-[clamp(0.9rem,1.3vw,1.4rem)]'}`}>{unit}</span>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <span data-rule className="h-px w-12 origin-left bg-burnt" />
        <span className="t-label text-mute">{label}</span>
      </div>
    </div>
  );
}

export function Performance() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-rule]').forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: EASE.out, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
      });
      gsap.fromTo('[data-tr] > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: EASE.out, scrollTrigger: { trigger: '[data-tr]', start: 'top 90%', once: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="performance" data-nav="performance" className="relative overflow-hidden bg-ink px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
      <div className="mx-auto grid max-w-[1920px] gap-14 lg:grid-cols-12 lg:gap-8">
        {/* Numbers */}
        <div className="lg:col-span-6 xl:col-span-6">
          <Lines lines={['POWER IS ONLY', 'THE BEGINNING.']} className="t-display text-[clamp(2.3rem,5.2vw,6.4rem)]" />
          <div className="mt-14 lg:mt-20">
            <Stat value={620} unit="HP" label="Maximum power" big />
          </div>
          <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-2">
            <Stat value={3.2} decimals={1} unit="sec" label="0–100 km/h" />
            <Stat value={320} unit="km/h" label="Top speed" />
          </div>
          <dl data-tr className="mt-16 max-w-xl border-t border-white/15">
            {[
              ['Transmission', '8-speed dual-clutch'],
              ['Drivetrain', 'Rear-wheel drive'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-white/15 py-5">
                <dt className="t-label text-mute">{k}</dt>
                <dd className="t-display t-wide text-[clamp(0.95rem,1.3vw,1.25rem)] tracking-[0.02em]">{v}</dd>
              </div>
            ))}
          </dl>
          <Fade className="mt-6 max-w-xl text-[12px] leading-relaxed text-mute">
            <p>Concept specifications for the fictional APEX X1. Figures are illustrative and do not describe a production vehicle.</p>
          </Fade>
        </div>

        {/* Technical detail image */}
        <div className="lg:col-span-6 lg:pt-28 xl:pt-36">
          <MediaFrame className="aspect-[4/3] w-full bg-graphite sm:aspect-[16/11]" dir="left" parallax={5}>
            <div className="cq absolute inset-0">
              <div className="cover-anchor" style={{ ['--r' as string]: 1280 / 720 } as React.CSSProperties}>
                <Img src="/media/view-exterior.webp" ratio={1280 / 720} alt="APEX X1 concept, front three-quarter view in a dark studio, with technical callouts" sizes="(min-width:1024px) 50vw, 100vw" className="absolute inset-0 h-full w-full" />
                <div className="absolute inset-0">
                  <TagLabel t={{ x: 640, y: 368, text: 'Adaptive LED headlamp', side: 'l' }} w={1280} h={720} />
                  <TagLabel t={{ x: 560, y: 538, text: 'Carbon front splitter', side: 'l' }} w={1280} h={720} />
                  <TagLabel t={{ x: 905, y: 545, text: 'Forged wheel', side: 'r' }} w={1280} h={720} />
                </div>
              </div>
            </div>
            <div className="grain pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </MediaFrame>
          <div className="mt-4 flex items-center justify-between text-mute">
            <span className="t-label">APEX X1 — concept render</span>
            <span className="t-label">Callouts are illustrative</span>
          </div>
        </div>
      </div>
    </section>
  );
}
