import { ArrowUpRight } from 'lucide-react';
import type { ReactNode, MouseEventHandler } from 'react';

interface Props {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  href?: string;
  variant?: 'primary' | 'ghost' | 'light';
  icon?: boolean;
  className?: string;
  'aria-label'?: string;
  type?: 'button' | 'submit';
}

const base =
  'group relative inline-flex min-h-[48px] items-center justify-center gap-3 overflow-hidden px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burnt ' +
  'before:absolute before:inset-0 before:-translate-x-[101%] before:transition-transform before:duration-[600ms] before:ease-apex hover:before:translate-x-0 focus-visible:before:translate-x-0';

const variants = {
  primary: 'bg-burnt text-ink before:bg-bone',
  ghost: 'border border-white/30 text-bone before:bg-bone hover:text-ink focus-visible:text-ink hover:border-bone',
  light: 'bg-ink text-bone before:bg-burnt hover:text-ink',
};

export function Button({ children, onClick, href, variant = 'primary', icon = true, className = '', type = 'button', ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <>
      <span className="relative z-10 transition-colors duration-300">{children}</span>
      {icon && (
        <ArrowUpRight
          aria-hidden="true"
          className="relative z-10 h-4 w-4 transition-transform duration-500 ease-apex group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  );
  if (href) {
    return (
      <a href={href} onClick={onClick as MouseEventHandler<HTMLAnchorElement>} className={cls} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick as MouseEventHandler<HTMLButtonElement>} className={cls} {...rest}>
      {inner}
    </button>
  );
}

/** Understated text link with a drawn underline. */
export function TextLink({ children, onClick, href, className = '' }: { children: ReactNode; onClick?: () => void; href?: string; className?: string }) {
  const cls = `group relative inline-flex items-center gap-2 py-2 text-[12px] font-bold uppercase tracking-[0.16em] text-bone focus-ring ${className}`;
  const line = <span className="absolute bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-bone/40 transition-transform duration-500 ease-apex group-hover:scale-x-0" />;
  const line2 = <span className="absolute bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-burnt transition-transform duration-500 ease-apex group-hover:origin-left group-hover:scale-x-100" />;
  if (href) return <a href={href} onClick={onClick} className={cls}>{children}{line}{line2}</a>;
  return <button type="button" onClick={onClick} className={cls}>{children}{line}{line2}</button>;
}
