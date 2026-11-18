'use client';

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Calm 3D tilt on hover with a soft light sweep.
 * Children may use `[transform:translateZ(..)]` for gentle layered depth.
 */
export default function TiltCard({
  children,
  className,
  max = 6,
  sheen = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  sheen?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 140, damping: 22, mass: 0.7 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const light = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, rgba(255,255,255,.55), transparent 42%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="h-full [perspective:1200px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={cn('group relative h-full will-change-transform', className)}
      >
        {children}
        {sheen && (
          <motion.div
            aria-hidden
            style={{ background: light }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
      </motion.div>
    </div>
  );
}
