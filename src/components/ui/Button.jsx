import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/utils/cn';

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

/**
 * Agency CTA button.
 *  variant="primary" → teal fill with a travelling shine (Magic UI "Shimmer Button", 21st.dev)
 *  variant="ghost"   → glass outline whose border lights up on hover
 * Magnetic pull from Motion Primitives "Magnetic". Pass `to` for routes, `href` for external links.
 */
export default function Button({ to, href, children, variant = 'primary', icon = 'ph ph-arrow-up-right', magnetic = true, className, ...rest }) {
  const mag = useMagnetic(0.2);
  const props = {
    className: cn('btn', `btn--${variant}`, className),
    ...(magnetic ? mag : {}),
    ...rest,
  };
  const inner = (
    <>
      {variant === 'primary' && <span className="btn__shine" aria-hidden />}
      <span className="btn__label">{children}</span>
      {icon && (
        <span className="btn__icon" aria-hidden>
          <i className={icon} />
        </span>
      )}
    </>
  );

  if (to)
    return (
      <MotionLink to={to} {...props}>
        {inner}
      </MotionLink>
    );
  const external = href && /^https?:/.test(href);
  return (
    <motion.a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} {...props}>
      {inner}
    </motion.a>
  );
}
