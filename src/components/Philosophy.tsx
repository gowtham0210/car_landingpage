import { useEffect, useRef } from 'react';
import { gsap, EASE, reducedMotion } from '../lib/motion';
import { Lines, Fade, MediaFrame } from './Reveal';
import { Img } from './Img';

const PRINCIPLES = [
  { k: 'Proportion', t: 'Low, wide and short in the overhang. The stance is decided before a single line is drawn.' },
  { k: 'Material', t: 'Carbon, Alcantara and polished metal are left honest. Each is chosen for how it looks and how it feels under the hand.' },
  { k: 'Performance', t: 'Nothing is added for show. If a surface exists, it is managing air, cooling a component or saving weight.' },
  { k: 'Experience', t: 'The result is felt before it is measured: in the weight of the wheel, the sound of the door, the first turn-in.' },
];

export function Philosophy() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-draw]').forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: EASE.inOut, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="philosophy" className="relative bg-ink">
      {/* Dark opening */}
      <div className="mx-auto max-w-[1920px] px-5 pb-24 pt-28 sm:px-8 lg:px-12 lg:pb-40 lg:pt-44">
        <Lines lines={['FORM FOLLOWS', 'FEELING.']} className="t-display t-wide text-[clamp(2.4rem,7.4vw,9rem)] [font-stretch:120%]" />
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <Fade className="t-body lg:col-span-4 lg:col-start-8"><p>A car is judged in a glance and remembered by touch. We start with proportion, let materials carry the character and test everything against how it feels to drive.</p></Fade>
        </div>
      </div>

      {/* Light editorial panel */}
      <div className="bg-bone text-ink">
        <div className="mx-auto grid max-w-[1920px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-36">
          <div className="grid grid-cols-2 gap-4 lg:col-span-5 lg:gap-6">
            <MediaFrame className="col-span-2 aspect-[16/10] bg-ink" dir="up" parallax={6}>
              <Img name="interior" widths={[1200, 2400]} ratio={3840 / 2560} sizes="(min-width:1024px) 40vw, 100vw" alt="Close view of orange Alcantara trim and contrast stitching on the dashboard" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '66% 28%', transform: 'scale(1.9)', transformOrigin: '66% 28%' }} />
            </MediaFrame>
            <MediaFrame className="aspect-[4/5] bg-ink" dir="left" parallax={6}>
              <Img name="wheel" widths={[1000, 2000]} ratio={2000 / 1333} sizes="25vw" alt="Carbon-fibre weave on the side vent next to the wheel" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '92% 58%', transform: 'scale(2.2)', transformOrigin: '92% 58%' }} />
            </MediaFrame>
            <MediaFrame className="aspect-[4/5] bg-ink" dir="right" parallax={6}>
              <Img name="interior" widths={[1200, 2400]} ratio={3840 / 2560} sizes="25vw" alt="Carbon-fibre and leather steering wheel rim" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '28% 60%', transform: 'scale(2.1)', transformOrigin: '28% 60%' }} />
            </MediaFrame>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
            <div className="flex flex-col">
              {PRINCIPLES.map((p) => (
                <div key={p.k} className="relative py-8 lg:py-10">
                  <div data-draw className="absolute left-0 top-0 h-px w-full origin-left bg-ink/80" />
                  <div className="grid gap-3">
                    <h3 className="t-display t-wide text-[clamp(1.4rem,2.2vw,2.3rem)]">{p.k}</h3>
                    <p className="max-w-[44ch] text-[15px] leading-relaxed text-ink/75">{p.t}</p>
                  </div>
                </div>
              ))}
              <div className="relative">
                <div data-draw className="h-px w-full origin-left bg-ink/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
