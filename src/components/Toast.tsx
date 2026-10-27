import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';

const Ctx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('');
  const timer = useRef<number>();
  const show = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(''), 4200);
  }, []);
  return (
    <Ctx.Provider value={show}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
        <div
          className={`max-w-md border border-white/15 bg-graphite/95 px-5 py-3 text-[13px] leading-snug text-bone shadow-2xl backdrop-blur transition-all duration-500 ease-apex ${msg ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          {msg}
        </div>
      </div>
    </Ctx.Provider>
  );
}
