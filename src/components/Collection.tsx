import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { MODELS, type ModelData } from '../data/site';
import { Lines, Fade } from './Reveal';
import { Img } from './Img';
import { Button } from './Button';

const CARD: Record<string, { w: string; ratio: string }> = {
  x1: { w: 'w-[84vw] sm:w-[640px] lg:w-[860px]', ratio: 'aspect-[16/11]' },
  gt: { w: 'w-[72vw] sm:w-[420px] lg:w-[460px]', ratio: 'aspect-[4/5]' },
  er: { w: 'w-[78vw] sm:w-[520px] lg:w-[580px]', ratio: 'aspect-square' },
};

function ModelCard({ m, i, onOpen }: { m: ModelData; i: number; onOpen: () => void }) {
  const c = CARD[m.id];
  return (
    <article data-card className={`group shrink-0 snap-start ${c.w} ${i === 1 ? 'lg:mt-24' : i === 2 ? 'lg:mt-10' : ''}`}>
      <button type="button" onClick={onOpen} aria-label={`Explore ${m.name}`} className="focus-ring relative block w-full overflow-hidden bg-graphite">
        <div className={`relative ${c.ratio} w-full overflow-hidden`}>
          <Img
            name={m.image.name} widths={m.image.widths} ratio={m.image.ratio}
            sizes="(min-width:1024px) 860px, 84vw"
            alt={`${m.name} concept — ${m.role}`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-apex group-hover:scale-[1.06]"
            style={{ objectPosition: m.pos, filter: m.filter }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <span className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 transition-transform duration-700 ease-apex group-hover:scale-y-100" style={{ background: m.accent }} />
          <span className="t-label absolute left-5 top-5 bg-ink/70 px-3 py-2 text-[10px] backdrop-blur-sm">Concept</span>
        </div>
      </button>
      <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h3 className="t-display t-wide text-[clamp(1.5rem,2.3vw,2.6rem)]">{m.name}</h3>
          <p className="mt-1 text-[14px] text-mute">{m.role}</p>
          <p className="mt-3 max-w-[44ch] text-[14px] leading-relaxed text-bone/75">{m.blurb}</p>
        </div>
        <Button onClick={onOpen} variant="ghost" className="w-full sm:w-auto" aria-label={`Explore ${m.name}`}>Explore model</Button>
      </div>
      <dl className="mt-6 grid grid-cols-3 border-t border-white/15">
        {m.specs.map((s) => (
          <div key={s.label} className="pt-4">
            <dt className="t-label text-[10px] text-mute">{s.label}</dt>
            <dd className="t-cond mt-1 text-[clamp(1.5rem,2.2vw,2.3rem)]" style={{ color: m.id === 'er' ? '#ece8e0' : undefined }}>{s.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function Drawer({ m, onClose, onNext }: { m: ModelData; onClose: () => void; onNext: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [onClose]);
  return (
    <motion.div className="fixed inset-0 z-[70]" initial="h" animate="v" exit="h" role="dialog" aria-modal="true" aria-label={`${m.name} details`}>
      <motion.div variants={{ h: { opacity: 0 }, v: { opacity: 1 } }} className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />
      <motion.aside
        variants={{ h: { x: '100%' }, v: { x: 0 } }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        className="absolute right-0 top-0 flex h-full w-full max-w-[680px] flex-col overflow-y-auto bg-graphite"
      >
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={m.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              <Img name={m.image.name} widths={m.image.widths} ratio={m.image.ratio} sizes="680px" alt={`${m.name} concept`} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: m.pos, filter: m.filter }} />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-transparent" />
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close model details" className="focus-ring absolute right-4 top-4 flex h-11 w-11 items-center justify-center bg-ink/70 backdrop-blur transition-colors hover:bg-bone hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col px-6 pb-8 sm:px-10">
          <p className="t-label" style={{ color: m.accent }}>Concept model</p>
          <h3 className="t-display t-wide mt-3 text-[clamp(2rem,4vw,3.2rem)]">{m.name}</h3>
          <p className="mt-2 text-mute">{m.role}</p>
          <p className="mt-6 max-w-[52ch] leading-relaxed text-bone/80">{m.detail}</p>
          <dl className="mt-8 border-t border-white/15">
            {[...m.specs, ...m.more].map((s) => (
              <div key={s.label} className="flex items-baseline justify-between gap-6 border-b border-white/15 py-3.5">
                <dt className="t-label text-mute">{s.label}</dt>
                <dd className="text-right text-[15px]">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-[12px] leading-relaxed text-mute">Concept content for a fictional brand. Specifications are illustrative and not verified for a real vehicle.</p>
          <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
            <Button onClick={onNext}>Next model</Button>
            <Button onClick={onClose} variant="ghost" icon={false}>Back to collection</Button>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}

export function Collection({ openId, setOpenId }: { openId: string | null; setOpenId: (id: string | null) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false, p: 0 });
  const open = MODELS.find((m) => m.id === openId) || null;

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft > max - 8, p: max > 0 ? el.scrollLeft / max : 0 });
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = rail.current;
    const card = el?.querySelector<HTMLElement>('[data-card]');
    if (el && card) el.scrollBy({ left: dir * (card.offsetWidth + 40), behavior: 'smooth' });
  };
  const next = () => open && setOpenId(MODELS[(MODELS.indexOf(open) + 1) % MODELS.length].id);
  const close = useCallback(() => setOpenId(null), [setOpenId]);

  return (
    <section id="collection" data-nav="collection" className="relative overflow-hidden bg-graphite py-28 lg:py-40">
      <div className="mx-auto flex max-w-[1920px] flex-col justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:px-12">
        <div>
          <Lines lines={['CHOOSE YOUR', 'MACHINE.']} className="t-display text-[clamp(2.6rem,7vw,8.4rem)]" />
          <Fade className="t-body mt-6" delay={0.1}><p>Three concepts, three characters. Swipe, drag or use the arrows. All figures are concept specifications.</p></Fade>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous model" className="focus-ring flex h-12 w-12 items-center justify-center border border-white/25 transition-colors hover:bg-bone hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-bone"><ArrowLeft className="h-5 w-5" /></button>
          <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label="Next model" className="focus-ring flex h-12 w-12 items-center justify-center border border-white/25 transition-colors hover:bg-bone hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-bone"><ArrowRight className="h-5 w-5" /></button>
        </div>
      </div>

      <div
        ref={rail}
        onScroll={measure}
        tabIndex={0}
        role="group"
        aria-label="Concept models, scrollable"
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-10 overflow-x-auto scroll-smooth px-5 pb-6 focus-visible:outline-none sm:px-8 lg:mt-20 lg:px-12"
        style={{ scrollPaddingLeft: 'max(1.25rem, 3vw)' }}
      >
        {MODELS.map((m, i) => <ModelCard key={m.id} m={m} i={i} onOpen={() => setOpenId(m.id)} />)}
        <div className="w-1 shrink-0 lg:w-12" aria-hidden="true" />
      </div>

      <div className="mx-auto mt-8 max-w-[1920px] px-5 sm:px-8 lg:px-12">
        <div className="h-px w-full bg-white/15"><div className="h-full origin-left bg-burnt transition-transform duration-300" style={{ transform: `scaleX(${0.2 + edge.p * 0.8})` }} /></div>
      </div>

      <AnimatePresence>{open && <Drawer key="drawer" m={open} onClose={close} onNext={next} />}</AnimatePresence>
    </section>
  );
}
