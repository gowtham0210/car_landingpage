import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { gsap, reducedMotion, scrollToId, scrollToTop } from '../lib/motion';
import { Lines, Fade } from './Reveal';
import { Button, TextLink } from './Button';
import { Img } from './Img';

export function FinalCTA() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-cta-img]', { scale: 1.0 }, { scale: 1.1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('[data-cta-line]', { scaleX: 0 }, { scaleX: 1, duration: 2, ease: 'power3.inOut', scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } });
      gsap.to('[data-cta-glow]', { opacity: 0.35, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.fromTo('[data-cta-sweep]', { xPercent: -120 }, { xPercent: 420, duration: 4.5, repeat: -1, repeatDelay: 2.5, ease: 'power2.inOut' });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="cta" data-nav="collection" className="relative flex min-h-[100svh] w-full items-start overflow-hidden bg-[#080809] lg:items-center">
      <div className="cq absolute inset-0">
        <div data-cta-img className="absolute inset-0 will-change-transform">
          <div className="cover-anchor [--sx:0px] lg:[--sx:13cqw]" style={{ ['--r' as string]: 1800 / 1005, transform: 'translate(calc(-50% + var(--sx)), -50%)' } as CSSProperties}>
            <Img name="rear" widths={[900, 1800]} ratio={1800 / 1005} sizes="100vw" alt="Black APEX coupe alone in the dark, tail lights glowing" className="absolute inset-0 h-full w-full" />
            <div data-cta-glow className="pointer-events-none absolute mix-blend-screen" style={{ left: '21%', top: '43%', width: '34%', height: '13%', background: 'radial-gradient(ellipse at center, rgba(255,70,20,0.6), rgba(255,70,20,0) 70%)', filter: 'blur(14px)' }} />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080809] via-[#080809]/70 to-transparent lg:via-[#080809]/40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-graphite to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink to-transparent" />
      <div className="grain pointer-events-none absolute inset-0" />

      {/* Thin burnt-orange light accent along the floor */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[17%] h-px overflow-hidden">
        <div data-cta-line className="relative h-full w-full origin-left bg-gradient-to-r from-transparent via-burnt to-transparent">
          <div data-cta-sweep className="absolute inset-y-[-1px] w-1/5 bg-gradient-to-r from-transparent via-bone to-transparent" />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-5 pt-32 sm:px-8 lg:px-12 lg:pt-16">
        <Lines lines={['THE ROAD', 'IS YOURS.']} as="h2" className="t-display text-[clamp(3rem,8.6vw,10.5rem)]" />
        <Fade className="t-body mt-7 text-bone/85" delay={0.15}><p>Discover a different perspective on performance.</p></Fade>
        <Fade className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8" delay={0.25}>
          <Button onClick={() => scrollToId('collection')}>Explore the collection</Button>
          <TextLink onClick={scrollToTop}>Back to the top</TextLink>
        </Fade>
      </div>
    </section>
  );
}
