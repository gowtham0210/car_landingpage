import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { gsap, ScrollTrigger } from '../lib/motion';
import { useCinematic } from '../hooks/useMediaQuery';
import { Img } from './Img';
import { Lines, Fade, MediaFrame } from './Reveal';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
type Cam = { s: number; fx: number; fy: number };
const REAR = { name: 'rear', widths: [900, 1800], w: 1800, h: 1005, ratio: 1800 / 1005 };
const WHEEL = { name: 'wheel', widths: [1000, 2000], w: 2000, h: 1333, ratio: 2000 / 1333 };

/** Camera poses expressed as focal point (fraction of the image) + zoom. */
const CAM: Record<string, Cam> = {
  silhouette: { s: 1, fx: 0.5, fy: 0.5 },
  design: { s: 1.6, fx: 0.58, fy: 0.47 },
  aero: { s: 1.4, fx: 0.5, fy: 0.53 },
  rear: { s: 1.9, fx: 0.37, fy: 0.57 },
  reveal: { s: 1, fx: 0.5, fy: 0.5 },
};
const camTo = (c: Cam) => ({ scale: c.s, xPercent: -c.s * (c.fx - 0.5) * 100, yPercent: -c.s * (c.fy - 0.5) * 100 });
const camCss = (c: Cam) => `translate(${-c.s * (c.fx - 0.5) * 100}%, ${-c.s * (c.fy - 0.5) * 100}%) scale(${c.s})`;

const SCENES = [
  { id: 'silhouette', title: ['SILHOUETTE'], copy: 'Before the details, the shape. A single band of light finds the roof, the haunch and the stance.' },
  { id: 'design', title: ['DESIGN'], copy: 'One unbroken surface from glasshouse to haunch. Nothing added for effect, nothing left unresolved.' },
  { id: 'aero', title: ['AERODYNAMICS'], copy: 'Air is guided, not just cut. The rear deck lifts into a quiet spoiler while the flanks pull air toward the diffuser.' },
  { id: 'engineering', title: ['ENGINEERING'], copy: 'Forged wheels, carbon-ceramic discs and monobloc calipers, each sized for the load it will see.' },
  { id: 'rear', title: ['REAR DESIGN'], copy: 'A single blade of light spans the tail. Below it, the diffuser and twin exhausts ground a wide, planted stance.' },
  { id: 'reveal', title: ['BUILT WITHOUT', 'COMPROMISE.'], copy: 'APEX X1 — concept.' },
] as const;

/** Technical callouts in each image's own pixel space. side = which way the label runs. */
interface Tag { x: number; y: number; text: string; side: 'l' | 'r' }
const TAGS: Record<string, Tag[]> = {
  design: [
    { x: 1000, y: 348, text: 'Glasshouse', side: 'r' },
    { x: 1290, y: 524, text: 'Shoulder line', side: 'r' },
    { x: 905, y: 565, text: 'Rear haunch', side: 'l' },
  ],
  aero: [
    { x: 640, y: 468, text: 'Rear deck spoiler', side: 'l' },
    { x: 600, y: 662, text: 'Diffuser channel', side: 'l' },
    { x: 1000, y: 530, text: 'Flank air outlet', side: 'r' },
  ],
  rear: [
    { x: 700, y: 497, text: 'Full-width light blade', side: 'r' },
    { x: 560, y: 655, text: 'Rear diffuser', side: 'l' },
    { x: 742, y: 660, text: 'Twin exhaust', side: 'r' },
  ],
  engineering: [
    { x: 743, y: 560, text: 'Six-piston caliper', side: 'l' },
    { x: 1190, y: 520, text: 'Carbon-ceramic disc', side: 'r' },
    { x: 1018, y: 647, text: 'Centre-lock hub', side: 'r' },
    { x: 1007, y: 214, text: 'Forged monobloc wheel', side: 'r' },
    { x: 193, y: 1033, text: 'Carbon aero sill', side: 'r' },
  ],
};

/** Guide lines (pathLength-normalised so they can be drawn on scroll). */
const GUIDES = {
  design: ['M560 445 C650 392 800 352 990 346 C1090 345 1170 365 1228 410', 'M925 518 C1060 500 1230 506 1390 536'],
  aero: ['M120 330 C420 290 820 250 1200 300 S1560 380 1700 370', 'M120 392 C440 360 860 330 1240 380 S1580 450 1720 440', 'M430 640 C560 690 760 700 930 690'],
  rear: ['M420 497 L940 497', 'M414 650 L790 650'],
};

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */
export function TagLabel({ t, w, h }: { t: Tag; w: number; h: number }) {
  const left = t.side === 'l';
  const style: CSSProperties = {
    left: `${(t.x / w) * 100}%`,
    top: `${(t.y / h) * 100}%`,
    transform: `translate(${left ? '-100%' : '0'}, -50%) scale(var(--inv, 1))`,
    transformOrigin: left ? '100% 50%' : '0 50%',
  };
  return (
    <div data-tag className={`absolute flex items-center gap-2 whitespace-nowrap ${left ? 'flex-row-reverse' : ''}`} style={style}>
      <span className="h-2 w-2 shrink-0 rounded-full bg-burnt shadow-[0_0_0_4px_rgba(210,88,28,0.25)]" />
      <span className="h-px w-10 bg-bone/70 sm:w-14" />
      <span className="t-label bg-ink/60 px-2 py-1 text-[10px] text-bone backdrop-blur-[2px]">{t.text}</span>
    </div>
  );
}

function Guides({ paths, w, h, group }: { paths: string[]; w: number; h: number; group: string }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" data-guides={group}>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#d2581c" strokeWidth="1.1" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
      ))}
    </svg>
  );
}

function CoverBox({ ratio, children, className = '' }: { ratio: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={`cover-anchor ${className}`} style={{ ['--r' as string]: ratio } as CSSProperties}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cinematic (pinned) version                                           */
/* ------------------------------------------------------------------ */
function Pinned() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [idx, setIdx] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const cam = q('[data-cam]')[0];
      const bright = q('[data-bright]')[0];
      const strip = q('[data-strip]')[0];
      const wheel = q('[data-wheel]')[0];
      const wheelCam = q('[data-wheel-cam]')[0];
      const glow = q('[data-glow]')[0];
      const vignette = q('[data-vignette]')[0];
      const copies = SCENES.map((s) => q(`[data-copy="${s.id}"]`)[0]);
      const tagsOf = (k: string) => q(`[data-tags="${k}"] [data-tag]`);
      const guidesOf = (k: string) => q(`[data-guides="${k}"] path`);

      // initial state
      gsap.set(bright, { clipPath: 'inset(0% 92% 0% 0%)' });
      gsap.set(wheel, { clipPath: 'circle(0% at 50% 56%)' });
      gsap.set(copies.slice(1), { opacity: 0 });
      gsap.set('[data-tag]', { opacity: 0 });
      gsap.set(glow, { opacity: 0 });
      gsap.set(vignette, { opacity: 0.35 });
      gsap.set(cam, { transformOrigin: '50% 50%', ...camTo(CAM.silhouette) });
      gsap.set(copies[5].querySelectorAll('.line-mask > span'), { yPercent: 115 });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=600%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setIdx(Math.min(5, Math.floor(self.progress * 6))),
          onToggle: (self) => { trigger.current = self; },
        },
        onUpdate: () => {
          // keep callout labels at constant on-screen size while the camera zooms
          const s = Number(gsap.getProperty(cam, 'scale')) || 1;
          (cam as HTMLElement).style.setProperty('--inv', String(1 / s));
        },
      });
      trigger.current = tl.scrollTrigger as ScrollTrigger;

      const copyIn = (i: number, at = i + 0.08) => tl.fromTo(copies[i], { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, at);
      const copyOut = (i: number, at = i + 0.82) => tl.to(copies[i], { opacity: 0, y: -36, duration: 0.2, ease: 'power2.in' }, at);
      const tagsIn = (k: string, at: number) => tl.fromTo(tagsOf(k), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.08, ease: 'power2.out' }, at);
      const tagsOut = (k: string, at: number) => tl.to(tagsOf(k), { opacity: 0, duration: 0.18, ease: 'power2.in' }, at);
      const drawIn = (k: string, at: number) => tl.fromTo(guidesOf(k), { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.1, ease: 'power2.inOut' }, at);
      const drawOut = (k: string, at: number) => tl.to(guidesOf(k), { opacity: 0, duration: 0.2 }, at);

      // 1 — SILHOUETTE: a narrow band of light sweeps across the body
      tl.fromTo(bright, { clipPath: 'inset(0% 92% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 92%)', duration: 0.8, ease: 'none' }, 0)
        .fromTo(strip, { left: '-6%', opacity: 1 }, { left: '104%', duration: 0.8, ease: 'none' }, 0)
        .to(bright, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.3 }, 0.8)
        .to(strip, { opacity: 0, duration: 0.2 }, 0.8)
        .to(vignette, { opacity: 0.55, duration: 0.5 }, 0.8);
      copyOut(0);

      // 2 — DESIGN
      tl.to(cam, { ...camTo(CAM.design), duration: 0.7 }, 0.85);
      copyIn(1);
      drawIn('design', 1.3);
      tagsIn('design', 1.45);
      copyOut(1);
      tagsOut('design', 1.82);
      drawOut('design', 1.85);

      // 3 — AERODYNAMICS
      tl.to(cam, { ...camTo(CAM.aero), duration: 0.7 }, 1.85);
      copyIn(2);
      drawIn('aero', 2.2);
      tagsIn('aero', 2.4);
      copyOut(2, 2.74);
      tagsOut('aero', 2.74);
      drawOut('aero', 2.78);

      // 4 — ENGINEERING: iris opens onto the wheel
      tl.to(wheel, { clipPath: 'circle(85% at 50% 56%)', duration: 0.6 }, 2.6);
      tl.fromTo(wheelCam, { scale: 1 }, { scale: 1.1, duration: 1.4, ease: 'none' }, 2.7);
      copyIn(3, 3.02);
      tagsIn('engineering', 3.22);
      copyOut(3, 3.8);
      tagsOut('engineering', 3.78);
      tl.to(cam, { ...camTo(CAM.rear), duration: 0.2 }, 3.4); // repositions while the wheel layer covers it

      // 5 — REAR DESIGN: iris closes onto the tail
      tl.to(wheel, { clipPath: 'circle(0% at 50% 56%)', duration: 0.55 }, 3.85);
      tl.to(glow, { opacity: 0.9, duration: 0.4 }, 4.2);
      copyIn(4, 4.12);
      drawIn('rear', 4.3);
      tagsIn('rear', 4.42);
      copyOut(4, 4.82);
      tagsOut('rear', 4.8);
      drawOut('rear', 4.82);

      // 6 — COMPLETE REVEAL
      tl.to(cam, { ...camTo(CAM.reveal), duration: 0.8 }, 4.85);
      tl.to(glow, { opacity: 0.35, duration: 0.6 }, 4.9);
      tl.to(vignette, { opacity: 0.85, duration: 0.8 }, 4.9);
      tl.to(copies[5], { opacity: 1, duration: 0.01 }, 5.05);
      tl.to(copies[5].querySelectorAll('.line-mask > span'), { yPercent: 0, duration: 0.45, stagger: 0.1, ease: 'power3.out' }, 5.1);
      tl.to({}, { duration: 0.01 }, 5.99);
    }, root);
    return () => ctx.revert();
  }, []);

  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    const y = st.start + ((i + 0.5) / 6) * (st.end - st.start);
    gsap.to(window, { scrollTo: { y, autoKill: true }, duration: 1.1, ease: 'power3.inOut' });
  };

  const rearTagH = REAR.h;
  return (
    <section ref={root} id="machine" data-nav="machine" aria-label="The machine — scroll-driven vehicle showcase" className="relative h-[100svh] w-full overflow-hidden bg-ink">
      <div className="cq absolute inset-0">
        {/* Car (rear/profile still) with camera */}
        <CoverBox ratio={REAR.ratio}>
          <div data-cam className="absolute inset-0 will-change-transform">
            <Img name={REAR.name} widths={REAR.widths} ratio={REAR.ratio} alt="Black APEX concept coupe, rear three-quarter view, tail lights glowing" className="absolute inset-0 h-full w-full select-none" style={{ filter: 'brightness(0.17) contrast(1.15)' }} eager />
            <div data-bright className="absolute inset-0">
              <Img name={REAR.name} widths={REAR.widths} ratio={REAR.ratio} alt="" className="absolute inset-0 h-full w-full select-none" eager />
            </div>
            {/* taillight bloom */}
            <div data-glow className="pointer-events-none absolute mix-blend-screen" style={{ left: '21%', top: '43%', width: '34%', height: '13%', background: 'radial-gradient(ellipse at center, rgba(255,70,20,0.55), rgba(255,70,20,0) 70%)', filter: 'blur(14px)' }} />
            <Guides paths={GUIDES.design} w={REAR.w} h={REAR.h} group="design" />
            <Guides paths={GUIDES.aero} w={REAR.w} h={REAR.h} group="aero" />
            <Guides paths={GUIDES.rear} w={REAR.w} h={REAR.h} group="rear" />
            {(['design', 'aero', 'rear'] as const).map((k) => (
              <div key={k} data-tags={k} className="absolute inset-0">
                {TAGS[k].map((t) => <TagLabel key={t.text} t={t} w={REAR.w} h={rearTagH} />)}
              </div>
            ))}
          </div>
        </CoverBox>

        {/* Wheel detail layer (iris reveal) */}
        <div data-wheel className="absolute inset-0 bg-ink">
          <CoverBox ratio={WHEEL.ratio}>
            <div data-wheel-cam className="absolute inset-0 will-change-transform">
              <Img name={WHEEL.name} widths={WHEEL.widths} ratio={WHEEL.ratio} alt="Forged black wheel with orange brake caliper and carbon-ceramic disc" className="absolute inset-0 h-full w-full select-none" />
              <div data-tags="engineering" className="absolute inset-0">
                {TAGS.engineering.map((t) => <TagLabel key={t.text} t={t} w={WHEEL.w} h={WHEEL.h} />)}
              </div>
            </div>
          </CoverBox>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
        </div>
      </div>

      {/* Light strip */}
      <div data-strip className="pointer-events-none absolute inset-y-0 w-[7%] -translate-x-1/2 mix-blend-screen" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,232,224,0.0) 15%, rgba(255,190,150,0.5) 50%, rgba(236,232,224,0.0) 85%, transparent)', filter: 'blur(6px)' }} />

      {/* Scrims */}
      <div data-vignette className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 55%, transparent 40%, rgba(6,6,6,0.9) 100%)' }} />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/90 to-transparent" />
      <div className="grain pointer-events-none absolute inset-0" />

      {/* Copy */}
      <div className="absolute bottom-[11vh] left-12 z-10 h-[300px] w-[min(900px,60vw)]">
        {SCENES.map((s, i) => (
          <div key={s.id} data-copy={s.id} className="absolute inset-x-0 bottom-0" aria-hidden={idx !== i}>
            <div className="mb-5 flex items-center gap-4">
              <span className="t-cond text-[26px] text-burnt">{String(i + 1).padStart(2, '0')}</span>
              <span className="h-px w-14 bg-white/25" />
              <span className="t-label text-mute">of 06</span>
            </div>
            <h2 className={`t-display ${i === 5 ? 'text-[clamp(3rem,6vw,7rem)]' : 'text-[clamp(2.4rem,4.8vw,5.8rem)]'}`}>
              {s.title.map((l, k) => (
                <span key={k} className="line-mask"><span>{l}</span></span>
              ))}
            </h2>
            <p className="t-body mt-5">{s.copy}</p>
          </div>
        ))}
      </div>

      {/* Scene rail */}
      <div className="absolute right-12 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-1 lg:flex">
        {SCENES.map((s, i) => (
          <button key={s.id} type="button" onClick={() => goTo(i)} aria-label={`Scene ${i + 1}: ${s.title.join(' ')}`} aria-current={idx === i} className="focus-ring group flex items-center gap-4 py-2.5">
            <span className={`t-label transition-all duration-500 ease-apex ${idx === i ? 'translate-x-0 text-bone opacity-100' : 'translate-x-2 text-mute opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>{s.title[0].replace('.', '')}</span>
            <span className={`block h-px transition-all duration-500 ease-apex ${idx === i ? 'w-12 bg-burnt' : 'w-5 bg-white/35 group-hover:w-8'}`} />
          </button>
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-9 right-12 z-10 hidden items-baseline gap-3 lg:flex">
        <span className="t-label text-mute">Scroll to explore</span>
        <span className="t-cond text-[22px]"><span className="text-bone">{String(idx + 1).padStart(2, '0')}</span><span className="text-mute"> / 06</span></span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Stacked version: tablet, mobile and reduced-motion                  */
/* ------------------------------------------------------------------ */
function StaticFrame({ img, cam, dim = false }: { img: typeof REAR | typeof WHEEL; cam: Cam; dim?: boolean }) {
  return (
    <div className="cq absolute inset-0">
      <CoverBox ratio={img.ratio}>
        <div className="absolute inset-0" style={{ transform: camCss(cam), filter: dim ? 'brightness(0.55) contrast(1.15)' : undefined }}>
          <Img name={img.name} widths={img.widths} ratio={img.ratio} alt="" sizes="(min-width: 768px) 60vw, 100vw" className="absolute inset-0 h-full w-full" />
        </div>
      </CoverBox>
    </div>
  );
}

function Stack() {
  const items: { s: (typeof SCENES)[number]; img: typeof REAR | typeof WHEEL; cam: Cam; alt: string; dim?: boolean }[] = [
    { s: SCENES[0], img: REAR, cam: CAM.silhouette, alt: 'Silhouette of the black APEX coupe in the dark', dim: true },
    { s: SCENES[1], img: REAR, cam: CAM.design, alt: 'Roofline, glasshouse and rear haunch' },
    { s: SCENES[2], img: REAR, cam: CAM.aero, alt: 'Rear deck spoiler and flank bodywork' },
    { s: SCENES[3], img: WHEEL, cam: { s: 1, fx: 0.5, fy: 0.55 }, alt: 'Forged wheel with orange caliper and carbon-ceramic disc' },
    { s: SCENES[4], img: REAR, cam: CAM.rear, alt: 'Light blade, diffuser and twin exhausts at the rear' },
  ];
  return (
    <section id="machine" data-nav="machine" aria-label="The machine" className="relative bg-ink px-5 pb-8 pt-24 sm:px-8 md:pt-32">
      <div className="mx-auto max-w-[1100px]">
        <Lines lines={['THE MACHINE,', 'SCENE BY SCENE.']} className="t-display text-[clamp(2.4rem,9vw,5.5rem)]" />
        <Fade className="t-body mt-6"><p>Six views of the APEX X1 concept: the shape, the surfaces, the air, the hardware and the tail.</p></Fade>

        <div className="mt-14 flex flex-col gap-16 md:gap-24">
          {items.map((it, i) => (
            <article key={it.s.id} className={`grid items-end gap-6 md:grid-cols-12 md:gap-10 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <MediaFrame className="aspect-[4/5] w-full bg-graphite md:col-span-7 md:aspect-[16/11]" dir={i % 2 ? 'right' : 'left'} parallax={5}>
                <div role="img" aria-label={it.alt} className="absolute inset-0"><StaticFrame img={it.img} cam={it.cam} dim={it.dim} /></div>
              </MediaFrame>
              <div className="md:col-span-5">
                <div className="mb-4 flex items-center gap-4">
                  <span className="t-cond text-[24px] text-burnt">{String(i + 1).padStart(2, '0')}</span>
                  <span className="h-px w-10 bg-white/25" />
                </div>
                <Lines lines={[...it.s.title]} className="t-display text-[clamp(2rem,7vw,3.6rem)]" />
                <Fade className="t-body mt-4" delay={0.15}><p>{it.s.copy}</p></Fade>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 md:mt-28">
          <MediaFrame className="aspect-[4/5] w-full bg-graphite sm:aspect-[16/10]" dir="up" parallax={5}>
            <div role="img" aria-label="Full rear three-quarter view of the APEX concept coupe" className="absolute inset-0"><StaticFrame img={REAR} cam={CAM.reveal} /></div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
          </MediaFrame>
          <Lines lines={['BUILT WITHOUT', 'COMPROMISE.']} className="t-display mt-8 text-[clamp(2.4rem,9vw,5.5rem)]" />
        </div>
      </div>
    </section>
  );
}

export function Showcase() {
  const cinematic = useCinematic();
  // Pin-spacer heights depend on layout; refresh once fonts/images settle.
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => window.clearTimeout(t);
  }, [cinematic]);
  return cinematic ? <Pinned /> : <Stack />;
}
