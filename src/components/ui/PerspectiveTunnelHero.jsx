import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * Perspective Tunnel Hero — ported from the 21st.dev component (TSX + Tailwind) to this
 * codebase's JSX + plain CSS (styles: .tunnel-* in pages.css).
 *
 * Changes from the original:
 *  - Flight is driven by normal page scroll through a pinned (sticky) stage instead of
 *    hijacking the mouse wheel, so it works on touch devices and the page scrolls on afterwards.
 *  - Cards are landscape (16:10) to fit website screenshots, link to the live project,
 *    and use the Webscafe teal instead of indigo.
 *  - Centre content is passed in as `children`.
 *
 * Props: `items` [{ src, title, href }], `children` (centre content).
 */

const SPRING = { stiffness: 60, damping: 25, mass: 0.5 };
// progress at rest: title fully visible and the first cards already drifting in
const START_PROGRESS = 0.14;

function useCameraParallax(enabled) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (e) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

function TunnelCard({ card, progress, pointer, total, stage }) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const local = useTransform(progress, [start, start + staggerSpan], [0, 1]);

  const z = useTransform(local, [0, 1], [stage.isMobile ? -1200 : -1700, stage.isMobile ? 350 : 500]);
  const opacity = useTransform(local, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

  const width = stage.isMobile
    ? Math.max(150, Math.min(210, stage.width * 0.5))
    : Math.max(220, Math.min(330, stage.width * 0.22));
  const baseX = card.angleCos * stage.width * card.radiusFactorX;
  const baseY = card.angleSin * stage.height * card.radiusFactorY;
  const pan = stage.isMobile ? 20 : 45;

  const transform = useTransform([z, pointer.x, pointer.y], ([currZ, px, py]) => {
    const ox = baseX - px * pan;
    const oy = baseY - py * pan;
    return `translate3d(calc(-50% + ${ox}px), calc(-50% + ${oy}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
  });

  // fully transparent cards must not catch clicks meant for the cards behind them
  const pointerEvents = useTransform(opacity, (o) => (o > 0.4 ? 'auto' : 'none'));

  return (
    <motion.a
      href={card.item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${card.item.title} (opens in a new tab)`}
      tabIndex={-1}
      className="tunnel-card"
      style={{ width, transform, opacity, pointerEvents }}
    >
      <span className="tunnel-card__frame">
        <img src={card.item.src} alt="" draggable={false} loading="lazy" />
        <span className="tunnel-card__caption">{card.item.title}</span>
      </span>
    </motion.a>
  );
}

export default function PerspectiveTunnelHero({ items, children }) {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();
  const [stage, setStage] = useState({ width: 1440, height: 900, isMobile: false });

  useEffect(() => {
    const update = () =>
      setStage({ width: window.innerWidth, height: window.innerHeight, isMobile: window.innerWidth < 768 });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const cards = useMemo(
    () =>
      items.map((item, i) => {
        const golden = i * 137.5 * (Math.PI / 180);
        return {
          item,
          index: i,
          angleCos: Math.cos(golden),
          angleSin: Math.sin(golden),
          radiusFactorX: 0.28 + (i % 3) * 0.08,
          radiusFactorY: 0.26 + (i % 2) * 0.09,
          rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
        };
      }),
    [items]
  );

  // page scroll through the tall section → tunnel progress
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const mapped = useTransform(scrollYProgress, [0, 1], [START_PROGRESS, 1]);
  const progress = useSpring(mapped, { stiffness: 80, damping: 30, restDelta: 0.0001 });

  const pointer = useCameraParallax(!reduce);

  const titleScale = useTransform(progress, [0, 0.5, 1], [0.7, 1, 1.35]);
  const titleOpacity = useTransform(progress, [0, 0.12, 0.85, 1], [0.25, 1, 1, 0]);
  const promptOpacity = useTransform(progress, [START_PROGRESS, START_PROGRESS + 0.06], [1, 0]);

  return (
    <section ref={sectionRef} className="tunnel">
      {/* the stage clips (overflow: hidden), which flattens 3D — so depth lives in the scene inside it */}
      <div className="tunnel__stage">
        <div className="tunnel__dots" aria-hidden />
        <div className="tunnel__glow" aria-hidden />
        <div className="tunnel__ring tunnel__ring--inner" aria-hidden />
        <div className="tunnel__ring tunnel__ring--outer" aria-hidden />

        <div className="tunnel__scene" style={{ perspective: stage.isMobile ? '900px' : '1200px' }}>
          {/* sits at z = 0: distant cards pass behind it, near cards fly in front */}
          <motion.div className="tunnel__center" style={{ scale: titleScale, opacity: titleOpacity }}>
            {children}
          </motion.div>

          <div className="tunnel__space">
            {cards.map((card) => (
              <TunnelCard key={card.index} card={card} progress={progress} pointer={pointer} total={cards.length} stage={stage} />
            ))}
          </div>
        </div>

        <motion.div className="tunnel__prompt" style={{ opacity: promptOpacity }} aria-hidden>
          <span>Scroll to explore</span>
          <span className="tunnel__prompt-line" />
        </motion.div>
      </div>
    </section>
  );
}
