import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import Eyebrow from './Eyebrow';

const ease = [0.21, 0.47, 0.32, 0.98];
const rise = (delay) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.8, delay, ease },
});

/**
 * Page-opening hero: eyebrow pill, oversized headline, supporting copy and an optional slot.
 * Background: masked grid + teal "lamp" glow (Aceternity "Lamp" / Magic UI "Grid Pattern", 21st.dev).
 */
export default function PageHero({ eyebrow, title, description, children, className, size = 'xl' }) {
  return (
    <section className={cn('page-hero', `page-hero--${size}`, className)}>
      <div className="page-hero__lamp" aria-hidden />
      <div className="container">
        <motion.div {...rise(0.05)}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </motion.div>
        <motion.h1 className="page-hero__title" {...rise(0.15)}>
          {title}
        </motion.h1>
        {description && (
          <motion.p className="page-hero__desc" {...rise(0.3)}>
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div className="page-hero__extra" {...rise(0.42)}>
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
