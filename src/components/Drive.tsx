import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { gsap, reducedMotion } from '../lib/motion';
import { Lines, Fade } from './Reveal';

export function Drive() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ok, setOk] = useState(true);

  // Only play while on screen.
  useEffect(() => {
    const v = video.current;
    if (!v || reducedMotion()) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [ok]);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-drive-media]', { yPercent: -7, scale: 1.12 }, { yPercent: 7, scale: 1.02, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="drive" className="relative flex h-[100svh] min-h-[620px] w-full items-end overflow-hidden bg-char">
      <div data-drive-media className="absolute inset-0 will-change-transform">
        <img src="/media/drive-poster.webp" alt="APEX concept coupe driving a winding mountain road at golden hour" width={1280} height={720} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        {ok && (
          <video
            ref={video}
            muted loop playsInline preload="metadata"
            poster="/media/drive-poster.webp"
            aria-hidden="true" tabIndex={-1}
            className="absolute inset-0 h-full w-full object-cover"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setOk(false)}
          >
            <source src="/media/drive.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/15 to-ink/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1920px] items-end gap-8 px-5 pb-14 sm:px-8 lg:grid-cols-12 lg:px-12 lg:pb-20">
        <Lines lines={['BUILT FOR THE', 'OPEN ROAD.']} className="t-display text-[clamp(2.6rem,7.6vw,9.4rem)] lg:col-span-8" />
        <div className="lg:col-span-4">
          <Fade className="t-body text-bone/85" delay={0.15}>
            <p>Every curve. Every response. Every second behind the wheel.</p>
          </Fade>
        </div>
      </div>

      {ok && !reducedMotion() && (
        <button
          type="button"
          onClick={() => { const v = video.current; if (v) (v.paused ? v.play() : v.pause()); }}
          className="focus-ring absolute right-5 top-24 z-10 flex h-11 w-11 items-center justify-center border border-white/30 bg-ink/40 backdrop-blur-sm transition-colors hover:bg-bone hover:text-ink sm:right-8 lg:right-12"
          aria-label={playing ? 'Pause driving video' : 'Play driving video'}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      )}
    </section>
  );
}
