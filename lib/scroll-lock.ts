/**
 * Native page scroll lock for overlays (cart drawer, quick view, mobile menu).
 * Reference-counted so overlapping overlays don't unlock each other, and compensates for the
 * scrollbar width so the page doesn't shift sideways when it disappears.
 */
let locks = 0;

export function lockScroll(locked: boolean) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (locked) {
    if (locks++ === 0) {
      const scrollbar = window.innerWidth - root.clientWidth;
      root.style.overflow = 'hidden';
      if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    }
  } else if (locks > 0 && --locks === 0) {
    root.style.overflow = '';
    root.style.paddingRight = '';
  }
}
