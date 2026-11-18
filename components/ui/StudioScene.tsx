'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import BotanicalSprig from './BotanicalSprig';
import { cn } from '@/lib/utils';

export type SceneTone = 'forest' | 'stone' | 'velvet' | 'espresso';

const tones: Record<SceneTone, { bg: string; spot: string; arch: string; floor: string; sprig: string; glow: string }> = {
  forest: {
    bg: 'radial-gradient(120% 90% at 50% 8%, #3D5E4F 0%, #1B2A23 46%, #0C1310 100%)',
    spot: 'radial-gradient(closest-side, rgba(255,232,192,.42), transparent)',
    arch: 'linear-gradient(180deg, rgba(255,255,255,.07), rgba(0,0,0,.3))',
    floor: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.5))',
    sprig: 'text-[#9DB8A9]/[0.16]',
    glow: 'rgba(255,236,200,.16)',
  },
  stone: {
    bg: 'radial-gradient(120% 90% at 50% 0%, #FFFFFF 0%, #ECE5DA 46%, #CDC1AF 100%)',
    spot: 'radial-gradient(closest-side, rgba(255,255,255,.95), transparent)',
    arch: 'linear-gradient(180deg, rgba(255,255,255,.75), rgba(150,130,100,.22))',
    floor: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(70,55,35,.16))',
    sprig: 'text-sage/25',
    glow: 'rgba(255,255,255,.5)',
  },
  velvet: {
    bg: 'radial-gradient(110% 80% at 50% 14%, #33293D 0%, #17131C 52%, #09080B 100%)',
    spot: 'radial-gradient(closest-side, rgba(222,206,255,.32), transparent)',
    arch: 'linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.35))',
    floor: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.55))',
    sprig: 'text-[#C9B8E8]/[0.12]',
    glow: 'rgba(225,210,255,.16)',
  },
  espresso: {
    bg: 'radial-gradient(120% 90% at 50% 8%, #5A4633 0%, #261D15 48%, #110D09 100%)',
    spot: 'radial-gradient(closest-side, rgba(255,226,180,.4), transparent)',
    arch: 'linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.32))',
    floor: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.5))',
    sprig: 'text-[#E3C99B]/[0.14]',
    glow: 'rgba(255,226,180,.16)',
  },
};

/** Marble/stone plinth the objects stand on. */
function Plinth({ width }: { width: string }) {
  return (
    <div className="absolute bottom-[9%] left-1/2 -translate-x-1/2" style={{ width }}>
      <div
        className="h-[clamp(40px,7%,72px)] min-h-[44px] w-full"
        style={{ background: 'linear-gradient(90deg,#7F766A 0%,#CFC6B8 28%,#EEE7DC 48%,#BDB3A4 78%,#6F675C 100%)' }}
      />
      <div
        className="absolute -top-[13px] left-0 h-[26px] w-full rounded-[50%]"
        style={{ background: 'radial-gradient(ellipse at 45% 40%, #FAF6EF 0%, #DCD3C5 60%, #BFB4A4 100%)' }}
      />
      <div className="absolute -bottom-5 left-[-8%] h-6 w-[116%] rounded-[50%] bg-black/45 blur-md" />
    </div>
  );
}

/**
 * Art-directed "studio photograph" built in code: spotlight, arched niche, stone plinth,
 * botanical shadow and grain. Pass `src` to show real photography instead.
 */
export default function StudioScene({
  tone = 'forest',
  children,
  className,
  src,
  alt = '',
  plinth = true,
  plinthWidth = '52%',
  arch = true,
  sprig = true,
  objectsClassName,
  priority,
}: {
  tone?: SceneTone;
  children?: ReactNode;
  className?: string;
  src?: string;
  alt?: string;
  plinth?: boolean;
  plinthWidth?: string;
  arch?: boolean;
  sprig?: boolean;
  objectsClassName?: string;
  priority?: boolean;
}) {
  const t = tones[tone];

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  if (src) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        {children}
      </div>
    );
  }

  return (
    <div className={cn('grain relative isolate overflow-hidden', className)} style={{ background: t.bg }} onPointerMove={onMove}>
      <div aria-hidden className="absolute left-1/2 top-[-22%] h-[85%] w-[78%] -translate-x-1/2 animate-glow rounded-full blur-2xl" style={{ background: t.spot }} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(520px circle at var(--gx,50%) var(--gy,30%), ${t.glow}, transparent 50%)` }}
      />
      {arch && (
        <div
          aria-hidden
          className="absolute bottom-[14%] left-1/2 h-[70%] w-[58%] -translate-x-1/2 rounded-t-full"
          style={{ background: t.arch, boxShadow: 'inset 0 40px 80px rgba(0,0,0,.28)' }}
        />
      )}
      {sprig && <BotanicalSprig className={cn('absolute bottom-[12%] left-[6%] h-[62%]', t.sprig)} leaves={8} />}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[18%]" style={{ background: t.floor }} />
      {plinth && <Plinth width={plinthWidth} />}
      {children && (
        <div className={cn('absolute inset-x-0 flex items-end justify-center', plinth ? 'bottom-[calc(9%+clamp(40px,7%,72px)+4px)]' : 'bottom-[12%]', objectsClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}
