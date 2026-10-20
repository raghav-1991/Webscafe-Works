import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin reading-progress bar — adapted from Magic UI "Scroll Progress" (21st.dev). */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden />;
}
