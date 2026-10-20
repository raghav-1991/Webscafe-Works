import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

/**
 * Pill tabs with a sliding, glowing active background — adapted from the "Animated Tabs"
 * components on 21st.dev. `tabs`: [{ id, label, badge? }].
 * When the strip overflows (phones), left/right arrows appear to scroll it.
 */
export default function AnimatedTabs({ tabs, active, onChange, label, className }) {
  const layoutId = useId();
  const listRef = useRef(null);
  const [edges, setEdges] = useState({ overflow: false, left: false, right: false });

  const measure = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ overflow: max > 2, left: el.scrollLeft > 2, right: el.scrollLeft < max - 2 });
  }, []);

  useEffect(() => {
    const el = listRef.current;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      ro.disconnect();
    };
  }, [measure]);

  // keep the selected tab fully visible inside the strip
  useEffect(() => {
    const el = listRef.current;
    const tab = el?.querySelector('[aria-selected="true"]');
    if (!tab) return;
    const left = tab.offsetLeft - 8;
    const right = tab.offsetLeft + tab.offsetWidth + 8 - el.clientWidth;
    if (el.scrollLeft > left) el.scrollTo({ left, behavior: 'smooth' });
    else if (el.scrollLeft < right) el.scrollTo({ left: right, behavior: 'smooth' });
  }, [active]);

  const scroll = (dir) => {
    const el = listRef.current;
    el.scrollBy({ left: dir * Math.max(140, el.clientWidth * 0.6), behavior: 'smooth' });
  };

  return (
    <div className={cn('tabs-wrap', edges.overflow && 'is-overflowing', className)}>
      {edges.overflow && (
        <button
          type="button"
          className="tabs-arrow tabs-arrow--left"
          aria-label="Scroll tabs left"
          disabled={!edges.left}
          onClick={() => scroll(-1)}
        >
          <i className="ph ph-caret-left" />
        </button>
      )}

      <div
        ref={listRef}
        className={cn('tabs', edges.left && 'fade-left', edges.right && 'fade-right')}
        role="tablist"
        aria-label={label}
      >
        {tabs.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={cn('tabs__tab', selected && 'is-active')}
              onClick={() => onChange(t.id)}
            >
              {selected && (
                <motion.span
                  layoutId={layoutId}
                  className="tabs__indicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="tabs__label">{t.label}</span>
              {t.badge != null && <span className="tabs__badge">{t.badge}</span>}
            </button>
          );
        })}
      </div>

      {edges.overflow && (
        <button
          type="button"
          className="tabs-arrow tabs-arrow--right"
          aria-label="Scroll tabs right"
          disabled={!edges.right}
          onClick={() => scroll(1)}
        >
          <i className="ph ph-caret-right" />
        </button>
      )}
    </div>
  );
}
