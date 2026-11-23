import { createElement, type ReactNode } from 'react';

/**
 * Plain layout wrapper. Sections used to fade in one by one as they scrolled into view; that
 * effect was removed in the redesign (it read as templated and delayed content). The component
 * stays so existing markup keeps its structure; `delay` and `y` are accepted and ignored.
 */
export default function Reveal({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'p' | 'span';
}) {
  return createElement(as, { className }, children);
}
