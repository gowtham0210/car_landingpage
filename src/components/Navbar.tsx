import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV } from '../data/site';
import { scrollToId } from '../lib/motion';
import { Logo } from './Logo';
import { Button } from './Button';

export function Navbar({ active, ready }: { active: string | null; ready: boolean }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 60);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', key);
    const close = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('resize', close);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // let the overlay release scroll lock first
    window.setTimeout(() => scrollToId(id), open ? 250 : 0);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,transform,opacity] duration-500 ease-apex ${
          solid || open ? 'border-b border-white/10 bg-ink/85 backdrop-blur-md' : 'border-b border-transparent bg-gradient-to-b from-black/70 to-transparent'
        } ${ready ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      >
        <nav aria-label="Primary" className="mx-auto flex h-[72px] max-w-[1920px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" onClick={(e) => { e.preventDefault(); setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="focus-ring relative z-[60]" aria-label="APEX MOTORS — back to top">
            <Logo />
          </a>

          <ul className="hidden items-center gap-10 lg:flex">
            {NAV.map((n) => {
              const isActive = active === n.id;
              return (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={go(n.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className="focus-ring group relative block py-2 text-[12px] font-semibold uppercase tracking-[0.18em]"
                  >
                    <span className="relative block overflow-hidden">
                      <span className={`block transition-transform duration-500 ease-apex group-hover:-translate-y-full ${isActive ? 'text-bone' : 'text-bone/70'}`}>{n.label}</span>
                      <span aria-hidden="true" className="absolute left-0 top-0 block translate-y-full text-burnt transition-transform duration-500 ease-apex group-hover:translate-y-0">{n.label}</span>
                    </span>
                    <span className={`absolute bottom-0 left-0 h-px w-full origin-left bg-burnt transition-transform duration-500 ease-apex ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Button onClick={go('collection')} variant="primary" className="hidden !min-h-[42px] !px-5 !py-2.5 lg:inline-flex">
              Explore Models
            </Button>
            <button
              type="button"
              className="focus-ring relative z-[60] flex h-11 w-11 items-center justify-center lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3.5 w-6">
                <span className={`absolute left-0 h-[2px] w-full bg-bone transition-all duration-500 ease-apex ${open ? 'top-[6px] rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 top-[6px] h-[2px] bg-burnt transition-all duration-500 ease-apex ${open ? 'w-0 opacity-0' : 'w-4'}`} />
                <span className={`absolute left-0 h-[2px] w-full bg-bone transition-all duration-500 ease-apex ${open ? 'top-[6px] -rotate-45' : 'top-[12px]'}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col">
              {NAV.map((n, i) => (
                <li key={n.id} className="overflow-hidden border-b border-white/10">
                  <motion.a
                    href={`#${n.id}`}
                    onClick={go(n.id)}
                    className="focus-ring flex items-baseline justify-between py-5"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="t-display text-[clamp(2.2rem,10vw,3.4rem)]">{n.label}</span>
                    <span className={`t-label ${active === n.id ? 'text-burnt' : 'text-mute'}`}>{active === n.id ? 'Now' : ''}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-5">
              <Button onClick={go('collection')} className="w-full">Explore Models</Button>
              <p className="t-label text-mute">Engineered to exceed.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
