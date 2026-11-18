import type Lenis from 'lenis';

/** Shared Lenis instance so overlays (drawer, modal, menu) can pause smooth scrolling. */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const lockScroll = (locked: boolean) => {
  if (locked) {
    instance?.stop();
    document.documentElement.style.overflow = 'hidden';
  } else {
    instance?.start();
    document.documentElement.style.overflow = '';
  }
};

export const scrollToTop = () => {
  if (instance) instance.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
};
