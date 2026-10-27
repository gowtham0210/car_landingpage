import { useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { RotateCcw, Move } from 'lucide-react';
import { COLORWAYS, VIEWS, type ViewId } from '../data/site';
import { Lines, Fade } from './Reveal';

export function Explorer() {
  const [view, setView] = useState<ViewId>('exterior');
  const [color, setColor] = useState<(typeof COLORWAYS)[number]['id']>('obsidian');
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dirty = useRef(false);
  const v = VIEWS.find((a) => a.id === view)!;
  const c = COLORWAYS.find((a) => a.id === color)!;

  const recenter = () => {
    animate(x, 0, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    animate(y, 0, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
  };
  const reset = () => {
    setView('exterior');
    setColor('obsidian');
    recenter();
    dirty.current = false;
  };
  const pick = (id: ViewId) => { setView(id); recenter(); };

  const radioKeys = (e: React.KeyboardEvent, ids: string[], cur: string, set: (s: string) => void) => {
    const i = ids.indexOf(cur);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); set(ids[(i + 1) % ids.length]); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); set(ids[(i + ids.length - 1) % ids.length]); }
  };

  return (
    <section id="explorer" data-nav="machine" className="relative bg-ink px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1920px]">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <Lines lines={['MEET THE', 'MACHINE.']} className="t-display text-[clamp(2.6rem,7vw,8.4rem)] lg:col-span-8" />
          <Fade className="t-body lg:col-span-4" delay={0.15}>
            <p>Switch viewpoints, change the finish and drag the image to look closer. Every control changes what you see.</p>
          </Fade>
        </div>

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Viewer */}
          <div className="lg:col-span-8">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-graphite sm:aspect-[16/10]">
              <motion.div
                className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
                style={{ x, y, scale: 1.1 }}
                drag
                dragConstraints={{ left: -50, right: 50, top: -30, bottom: 30 }}
                dragElastic={0.15}
                onDragStart={() => (dirty.current = true)}
                aria-label="Vehicle image. Drag to pan."
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={view}
                    src={v.src}
                    srcSet={v.srcSet}
                    sizes="(min-width:1024px) 66vw, 100vw"
                    alt={v.alt}
                    draggable={false}
                    className="absolute inset-0 h-full w-full select-none object-cover"
                    style={{ filter: c.filter, transition: 'filter 700ms cubic-bezier(.16,1,.3,1)' }}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </AnimatePresence>
              </motion.div>
              <div className="pointer-events-none absolute inset-0 transition-colors duration-700" style={{ background: c.gel, mixBlendMode: 'color' }} />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(6,6,6,0.65))]" />
              <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 bg-ink/70 px-3 py-2 backdrop-blur-sm sm:left-6 sm:top-6">
                <span className="h-2 w-2 rounded-full" style={{ background: color === 'titanium' ? '#c9ccd0' : '#d2581c' }} />
                <span className="t-label text-[10px]">{v.label} · {c.name}</span>
              </div>
              <div className="pointer-events-none absolute bottom-4 right-4 hidden items-center gap-2 text-bone/70 sm:flex">
                <Move className="h-3.5 w-3.5" /><span className="t-label text-[10px]">Drag to pan</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-10 lg:col-span-4">
            <div>
              <h3 id="view-label" className="t-label text-mute">Viewpoint</h3>
              <div role="radiogroup" aria-labelledby="view-label" className="mt-4 flex flex-col border-t border-white/15">
                {VIEWS.map((a) => {
                  const on = a.id === view;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      tabIndex={on ? 0 : -1}
                      onClick={() => pick(a.id)}
                      onKeyDown={(e) => radioKeys(e, VIEWS.map((q) => q.id), view, (s) => pick(s as ViewId))}
                      className="focus-ring group relative flex items-center justify-between border-b border-white/15 py-4 text-left"
                    >
                      <span className={`t-display t-wide text-[clamp(1rem,1.6vw,1.5rem)] tracking-[0.02em] transition-all duration-500 ease-apex ${on ? 'translate-x-3 text-bone' : 'text-mute group-hover:translate-x-1.5 group-hover:text-bone'}`}>{a.label}</span>
                      <span className={`h-px transition-all duration-500 ease-apex ${on ? 'w-10 bg-burnt' : 'w-4 bg-white/30'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 id="color-label" className="t-label text-mute">Colour</h3>
              <div role="radiogroup" aria-labelledby="color-label" className="mt-4 flex gap-4">
                {COLORWAYS.map((a) => {
                  const on = a.id === color;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-label={a.name}
                      tabIndex={on ? 0 : -1}
                      onClick={() => setColor(a.id)}
                      onKeyDown={(e) => radioKeys(e, COLORWAYS.map((q) => q.id), color, (s) => setColor(s as typeof color))}
                      className={`focus-ring relative h-12 w-12 rounded-full border transition-all duration-500 ease-apex ${on ? 'scale-100 border-bone' : 'scale-90 border-white/20 hover:scale-100'}`}
                    >
                      <span className="absolute inset-1.5 rounded-full" style={{ background: a.swatch, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)' }} />
                    </button>
                  );
                })}
              </div>
              <p className="t-display t-wide mt-5 text-[1.05rem] tracking-[0.02em]" aria-live="polite">{c.name}</p>
              <p className="mt-1 text-[13px] text-mute">{c.note} Previews apply a studio colour grade to the supplied renders; full paint renders are still to be supplied.</p>
            </div>

            <button type="button" onClick={reset} className="focus-ring inline-flex w-fit items-center gap-3 border border-white/25 px-5 py-3 text-[12px] font-bold uppercase tracking-[0.16em] transition-colors hover:border-bone hover:bg-bone hover:text-ink">
              <RotateCcw className="h-4 w-4" /> Reset view
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
