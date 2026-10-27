import type { CSSProperties } from 'react';

interface Props {
  name?: string;
  widths?: number[];
  src?: string;
  alt: string;
  ratio: number;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
  draggable?: boolean;
}

/** Responsive webp with explicit intrinsic size so nothing shifts while loading. */
export function Img({ name, widths = [], src, alt, ratio, sizes = '100vw', className = '', style, eager = false }: Props) {
  const srcSet = name ? widths.map((w) => `/media/${name}-${w}.webp ${w}w`).join(', ') : undefined;
  const fallback = src ?? `/media/${name}-${widths[widths.length - 1]}.webp`;
  const w = 1600;
  return (
    <img
      src={fallback}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={w}
      height={Math.round(w / ratio)}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      style={style}
      draggable={false}
    />
  );
}
