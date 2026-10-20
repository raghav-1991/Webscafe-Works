import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '@/hooks/useMediaQuery';

/** Soft ambient light that trails the pointer (desktop only). Inspired by Aceternity "Spotlight". */
export default function CursorGlow() {
  const fine = useFinePointer();
  const x = useSpring(useMotionValue(-500), { stiffness: 120, damping: 25 });
  const y = useSpring(useMotionValue(-500), { stiffness: 120, damping: 25 });

  useEffect(() => {
    if (!fine) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [fine, x, y]);

  if (!fine) return null;
  return <motion.div className="cursor-glow" style={{ x, y }} aria-hidden />;
}
