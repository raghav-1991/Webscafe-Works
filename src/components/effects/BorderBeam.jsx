/**
 * Travelling light around a box's border — adapted from Magic UI "Border Beam" (21st.dev).
 * Parent needs `position: relative`. Pure CSS (conic-gradient + mask), see effects.css.
 */
export default function BorderBeam({ duration = 8, delay = 0 }) {
  return (
    <span
      className="border-beam"
      aria-hidden
      style={{ '--beam-duration': `${duration}s`, '--beam-delay': `-${delay}s` }}
    />
  );
}
