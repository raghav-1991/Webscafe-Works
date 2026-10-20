import { useEffect } from 'react';

/**
 * Card spotlight — inspired by Magic UI "Magic Card" / Aceternity "Card Spotlight" on 21st.dev.
 * One delegated pointer listener feeds --mx/--my to whichever `.spotlight` element is hovered,
 * so cards keep their original markup (no wrapper divs that would break template selectors).
 */
export function useSpotlight() {
  useEffect(() => {
    const onMove = (e) => {
      const el = e.target instanceof Element ? e.target.closest('.spotlight') : null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
}
