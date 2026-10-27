import { ArrowUp } from 'lucide-react';
import { MODELS, NAV, SOCIAL } from '../data/site';
import { scrollToId, scrollToTop } from '../lib/motion';
import { Logo } from './Logo';
import { useToast } from './Toast';

export function Footer({ openModel }: { openModel: (id: string) => void }) {
  const toast = useToast();
  const placeholder = (label: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    toast(`${label} is a placeholder. Add the real link in src/data/site.ts.`);
  };
  const ext = (href: string, label: string, text: string) =>
    href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="focus-ring text-bone/75 transition-colors hover:text-burnt">{text}</a>
    ) : (
      <a href="#" onClick={placeholder(label)} title="Placeholder — no real profile yet" className="focus-ring text-bone/75 transition-colors hover:text-burnt">{text}</a>
    );

  const col = 'flex flex-col gap-3 text-[14px]';
  return (
    <footer className="relative border-t border-white/10 bg-ink px-5 pb-8 pt-16 sm:px-8 lg:px-12 lg:pt-24">
      <div className="mx-auto max-w-[1920px]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-[34ch] text-[14px] leading-relaxed text-mute">Engineered to exceed. A fictional performance brand and concept showcase.</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="t-label mb-5 text-mute">Explore</h2>
              <ul className={col}>
                {NAV.map((n) => (
                  <li key={n.id}><a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); scrollToId(n.id); }} className="focus-ring text-bone/75 transition-colors hover:text-burnt">{n.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="t-label mb-5 text-mute">Concept collection</h2>
              <ul className={col}>
                {MODELS.map((m) => (
                  <li key={m.id}><a href="#collection" onClick={(e) => { e.preventDefault(); scrollToId('collection'); window.setTimeout(() => openModel(m.id), 700); }} className="focus-ring text-bone/75 transition-colors hover:text-burnt">{m.name}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="t-label mb-5 text-mute">Follow</h2>
              <ul className={col}>
                <li>{ext(SOCIAL.instagram, 'Instagram', 'Instagram')}</li>
                <li>{ext(SOCIAL.youtube, 'YouTube', 'YouTube')}</li>
                <li>{ext(SOCIAL.contact, 'Contact', 'Contact')}</li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-[12px] leading-relaxed text-mute">© {new Date().getFullYear()} APEX MOTORS. Fictional brand. All vehicles and specifications shown are concept content.</p>
          <button type="button" onClick={scrollToTop} className="focus-ring group inline-flex items-center gap-3 border border-white/25 px-4 py-3 text-[12px] font-bold uppercase tracking-[0.16em] transition-colors hover:border-bone hover:bg-bone hover:text-ink" aria-label="Back to top">
            Back to top <ArrowUp className="h-4 w-4 transition-transform duration-500 ease-apex group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}
