import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { gsap, EASE, reducedMotion, scrollToId } from '../lib/motion';
import { Lines } from './Reveal';
import { Button } from './Button';

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<'playing' | 'paused' | 'ended'>('paused');
  const [videoOk, setVideoOk] = useState(true);

  // Hidden start state (the loader covers it, so nothing flashes).
  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set('[data-hero-media]', { clipPath: 'inset(0% 0% 0% 100%)' });
      gsap.set('[data-hero-fade]', { opacity: 0, y: 22 });
    }, root);
    return () => ctx.revert();
  }, []);

  // Entrance
  useEffect(() => {
    if (!ready) return;
    const v = video.current;
    if (reducedMotion()) {
      if (v) v.pause();
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to('[data-hero-media]', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: EASE.inOut }, 0)
        .fromTo('[data-hero-scale]', { scale: 1.22 }, { scale: 1, duration: 2.8, ease: EASE.out }, 0)
        .to('[data-hero] .line-mask > span', { yPercent: 0, duration: 1.35, ease: EASE.out, stagger: 0.11 }, 0.55)
        .to('[data-hero-fade]', { opacity: 1, y: 0, duration: 1.1, ease: EASE.out, stagger: 0.12 }, 1.0);
    }, root);
    if (v) {
      v.playbackRate = 0.85;
      v.play().then(() => setState('playing')).catch(() => setState('paused'));
    }
    return () => ctx.revert();
  }, [ready]);

  // Scroll: car recedes slightly, copy lifts away, scene darkens into the next section.
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('[data-hero-parallax]', { yPercent: 14, ease: 'none', scrollTrigger: st });
      gsap.to('[data-hero-copy]', { y: -90, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } });
      gsap.to('[data-hero-shade]', { opacity: 1, ease: 'none', scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (state === 'ended') {
      v.currentTime = 0;
      v.play();
    } else if (v.paused) v.play();
    else v.pause();
  };

  return (
    <section ref={root} id="top" data-hero className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink" aria-label="APEX MOTORS introduction">
      {/* Media */}
      <div data-hero-media className="absolute inset-0">
        <div data-hero-parallax className="absolute inset-0 will-change-transform">
          <div data-hero-scale className="absolute inset-0 will-change-transform">
            <img
              src="/media/hero-still.webp"
              alt="Black APEX X1 supercar in a dark studio with a copper-lit backdrop"
              width={1280}
              height={720}
              className="absolute inset-0 h-full w-full object-cover object-[62%_50%] lg:object-[50%_50%]"
              fetchPriority="high"
            />
            {videoOk && (
              <video
                ref={video}
                muted
                playsInline
                preload="auto"
                poster="/media/hero-first.webp"
                aria-hidden="true"
                tabIndex={-1}
                className="absolute inset-0 h-full w-full object-cover object-[62%_50%] lg:object-[50%_50%]"
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
                }}
                onPlay={() => setState('playing')}
                onPause={() => setState((s) => (s === 'ended' ? s : 'paused'))}
                onEnded={() => {
                  setState('ended');
                  if (bar.current) bar.current.style.transform = 'scaleX(1)';
                }}
                onError={() => setVideoOk(false)}
              >
                <source src="/media/hero.mp4" type="video/mp4" />
              </video>
            )}
          </div>
        </div>
        {/* Scrims: legibility on the left, depth at the bottom, darkening on scroll */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-transparent lg:from-ink/85 lg:via-ink/35 lg:to-transparent lg:[background-size:68%_100%] lg:bg-no-repeat" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" />
        <div data-hero-shade className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
      </div>

      {/* Copy */}
      <div data-hero-copy className="relative z-10 mx-auto flex h-full max-w-[1920px] flex-col justify-end px-5 pb-28 sm:px-8 sm:pb-32 lg:justify-center lg:px-12 lg:pb-12 lg:pt-16">
        <h1 aria-label="APEX MOTORS. Engineered to exceed." className="max-w-[52rem]">
          <Lines manual as="span" lines={['APEX MOTORS']} className="t-display t-wide mb-5 block text-[clamp(13px,1.35vw,20px)] tracking-[0.34em] text-copper" />
          <Lines manual as="span" lines={['ENGINEERED', 'TO EXCEED.']} className="t-display block text-[clamp(2.9rem,6.2vw,8.2rem)]" />
        </h1>
        <p data-hero-fade className="t-body mt-7 max-w-[34ch] text-[16px] text-bone/80 sm:text-[17px]">
          Precision in every line. Power in every movement.
        </p>
        <div data-hero-fade className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button onClick={() => scrollToId('machine')}>Explore the machine</Button>
          <Button onClick={() => scrollToId('performance')} variant="ghost" icon={false}>Discover performance</Button>
        </div>
      </div>

      {/* Bottom rail: scroll cue + model identifier */}
      <div data-hero-fade className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1920px] items-end justify-between px-5 pb-6 sm:px-8 lg:px-12 lg:pb-9">
        <button type="button" onClick={() => scrollToId('machine')} className="focus-ring group flex items-center gap-4 py-2" aria-label="Scroll to the machine">
          <span className="relative block h-12 w-px overflow-hidden bg-white/20">
            <span className="absolute inset-x-0 top-0 block h-full origin-top bg-burnt" style={{ animation: 'pulse-line 2.2s var(--ease) infinite' }} />
          </span>
          <span className="t-label text-bone/70 transition-colors group-hover:text-bone">Scroll</span>
        </button>

        <div className="flex items-center gap-5">
          <div className="text-right" aria-label="Model APEX X1, number 1">
            <div className="t-label text-bone/70">Model</div>
            <div className="mt-1 flex items-baseline justify-end gap-3">
              <span className="t-display t-wide text-[15px] tracking-[0.04em]">APEX X1</span>
              <span className="t-cond text-[22px] text-burnt">/ 01</span>
            </div>
            <div className="mt-2 h-px w-36 bg-white/15 sm:w-48">
              <span ref={bar} className="block h-full origin-left bg-burnt" style={{ transform: 'scaleX(0)' }} />
            </div>
          </div>
          {videoOk && !reducedMotion() && (
            <button
              type="button"
              onClick={toggle}
              className="focus-ring flex h-11 w-11 items-center justify-center border border-white/25 text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink"
              aria-label={state === 'ended' ? 'Replay intro' : state === 'playing' ? 'Pause intro video' : 'Play intro video'}
            >
              {state === 'ended' ? <RotateCcw className="h-4 w-4" /> : state === 'playing' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
