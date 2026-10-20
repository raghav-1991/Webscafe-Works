import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { navigation, profile } from '@/data/profile';
import { img } from '@/utils/asset';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';
import SocialLinks from '@/components/ui/SocialLinks';

const ease = [0.21, 0.47, 0.32, 0.98];

/**
 * Floating glass navbar that tightens once you scroll — adapted from Aceternity
 * "Floating Navbar" / "Resizable Navbar" (21st.dev). Links get a sliding hover pill;
 * on phones it becomes a full-screen menu with staggered links.
 */
export default function Navbar() {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <motion.header
      className={cn('nav', scrolled && 'is-scrolled', open && 'is-open')}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="nav__bar">
        <Link to="/" className="nav__brand" aria-label={`${profile.brand} home`}>
          <span className="nav__logo">
            <img src={img('webscafe-logo.png')} alt="" />
          </span>
          <span className="nav__wordmark">{profile.brand}</span>
        </Link>

        <nav className="nav__links" aria-label="Main" onPointerLeave={() => setHovered(null)}>
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn('nav__link', isActive && 'is-active')}
              onPointerEnter={() => setHovered(item.to)}
            >
              {hovered === item.to && (
                <motion.span layoutId="nav-hover" className="nav__hover" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
              )}
              <span className="nav__link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <SocialLinks className="nav__socials" />
          <Button href={profile.website} className="nav__cta">
            webscafe.in
          </Button>
          <button
            type="button"
            className="nav__toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__sheet"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease }}
          >
            <motion.ul
              className="nav__sheet-links"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
            >
              {navigation.map((item, i) => (
                <motion.li
                  key={item.to}
                  variants={{ hidden: { opacity: 0, y: 30, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
                >
                  <NavLink to={item.to} className={({ isActive }) => cn('nav__sheet-link', isActive && 'is-active')}>
                    <span className="nav__sheet-index">0{i + 1}</span>
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
            <div className="nav__sheet-foot">
              <p>
                <i className="ph-duotone ph-map-pin" /> {profile.location}
              </p>
              <SocialLinks />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
