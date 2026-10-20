import { forwardRef, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Scroll-triggered blur-fade — inspired by Magic UI "Blur Fade" & Motion Primitives "In View".
 * Renders the element itself (`as`) so template class names / CSS selectors stay intact.
 * `amount` defaults to "some" (any pixel visible): a fraction like 0.15 can never be reached by a
 * section taller than ~6.6 viewports (e.g. the Our Works grid on phones), leaving it invisible.
 */
const variantsFor = (y, blur, scale) => ({
  hidden: { opacity: 0, y, scale, filter: `blur(${blur}px)` },
  visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
});

const Reveal = forwardRef(function Reveal(
  { as = 'div', delay = 0, y = 24, blur = 6, scale = 1, duration = 0.7, once = true, amount = 'some', children, ...rest },
  ref
) {
  const Tag = motion[as]; // `as` is an HTML tag name: 'section', 'div', 'li', …
  const variants = useMemo(() => variantsFor(y, blur, scale), [y, blur, scale]);
  return (
    <Tag
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export default Reveal;

/** Stagger helper — wrap a list container, children use <Reveal.Item>. */
export function Stagger({ as = 'div', stagger = 0.08, delay = 0, amount = 'some', children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
    transitionEnd: { filter: 'none' },
  },
};

export function StaggerItem({ as = 'div', children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag variants={itemVariants} {...rest}>
      {children}
    </Tag>
  );
}
