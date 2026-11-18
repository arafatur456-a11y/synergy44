'use client';

import { motion, useReducedMotion } from 'framer-motion';

/** Fine-line botanical illustration that draws itself in when it enters view. */
export default function BotanicalSprig({ className, leaves = 7 }: { className?: string; leaves?: number }) {
  const reduce = useReducedMotion();
  const leafPaths: string[] = [];
  for (let i = 0; i < leaves; i++) {
    const y = 360 - i * 46;
    const s = 1 - i * 0.07; // leaves shrink toward the tip
    const side = i % 2 === 0 ? -1 : 1;
    const x = 100 + side * 2;
    leafPaths.push(
      `M${x} ${y} C ${x + side * 34 * s} ${y - 6 * s}, ${x + side * 56 * s} ${y - 34 * s}, ${x + side * 60 * s} ${y - 62 * s} C ${x + side * 32 * s} ${y - 52 * s}, ${x + side * 10 * s} ${y - 30 * s}, ${x} ${y}`,
    );
    leafPaths.push(`M${x} ${y} C ${x + side * 22 * s} ${y - 18 * s}, ${x + side * 42 * s} ${y - 40 * s}, ${x + side * 56 * s} ${y - 58 * s}`);
  }

  const draw = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true },
          transition: { duration: 2.4, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <svg viewBox="0 0 200 400" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" className={className} aria-hidden>
      <motion.path d="M100 398 C 96 300, 108 190, 98 40 C 96 28, 100 18, 104 10" {...draw(0)} />
      {leafPaths.map((d, i) => (
        <motion.path key={i} d={d} {...draw(0.35 + i * 0.08)} strokeWidth={i % 2 ? 0.7 : 1.1} />
      ))}
    </svg>
  );
}
