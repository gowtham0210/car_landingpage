import { useEffect, useState } from 'react';
import { ScrollTrigger } from './lib/motion';
import { useActiveNav } from './hooks/useActiveSection';
import { ToastProvider } from './components/Toast';
import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Showcase } from './components/Showcase';
import { Performance } from './components/Performance';
import { Engineering } from './components/Engineering';
import { Explorer } from './components/Explorer';
import { Drive } from './components/Drive';
import { Philosophy } from './components/Philosophy';
import { Collection } from './components/Collection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export default function App() {
  const [ready, setReady] = useState(false);
  const [openModel, setOpenModel] = useState<string | null>(null);
  const active = useActiveNav();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <ToastProvider>
      <a href="#machine" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-burnt focus:px-4 focus:py-3 focus:text-ink">Skip to content</a>
      <Loader onDone={() => setReady(true)} />
      <Navbar active={active} ready={ready} />
      <main>
        <Hero ready={ready} />
        <Showcase />
        <Performance />
        <Engineering />
        <Explorer />
        <Drive />
        <Philosophy />
        <Collection openId={openModel} setOpenId={setOpenModel} />
        <FinalCTA />
      </main>
      <Footer openModel={setOpenModel} />
    </ToastProvider>
  );
}
